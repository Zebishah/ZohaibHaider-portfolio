/* Depth-buffered software 3D. Incremental batches allow stale 4K frames to be cancelled. */
typedef unsigned int u32;
static double minf(double a,double b){return a<b?a:b;}
static double maxf(double a,double b){return a>b?a:b;}
static int clampi(int v,int a,int b){return v<a?a:v>b?b:v;}
static int floori(double v){int i=(int)v;return v<i?i-1:i;}
static u32 mixcolor(u32 a,u32 b,double amount){
 u32 out=0xff000000;
 for(int ch=0;ch<3;ch++)out|=((u32)(((a>>(ch*8))&255)*(1-amount)+((b>>(ch*8))&255)*amount))<<(ch*8);
 return out;
}
static u32 sample(u32 *texture,int size,double u,double v){
 double fx=u*size-.5,fy=v*size-.5;int ix=floori(fx),iy=floori(fy);
 int x0=clampi(ix,0,size-1),y0=clampi(iy,0,size-1),x1=clampi(ix+1,0,size-1),y1=clampi(iy+1,0,size-1);
 return mixcolor(mixcolor(texture[y0*size+x0],texture[y0*size+x1],fx-ix),mixcolor(texture[y1*size+x0],texture[y1*size+x1],fx-ix),fy-iy);
}

void prepare(int width,int height,int nv,float *vertices,float *matrix,float *projected,u32 *pixels,float *depth,u32 *ids){
 for(int i=0;i<width*height;i++){pixels[i]=0;depth[i]=1.0e30f;ids[i]=0;}
 for(int i=0;i<nv;i++){
  float *v=vertices+i*6,*p=projected+i*4;
  double w=matrix[3]*v[0]+matrix[7]*v[1]+matrix[11]*v[2]+matrix[15],iw=w>0?1.0/w:0;
  p[0]=((matrix[0]*v[0]+matrix[4]*v[1]+matrix[8]*v[2]+matrix[12])*iw*.5+.5)*width;
  p[1]=(.5-(matrix[1]*v[0]+matrix[5]*v[1]+matrix[9]*v[2]+matrix[13])*iw*.5)*height;
  p[2]=(matrix[2]*v[0]+matrix[6]*v[1]+matrix[10]*v[2]+matrix[14])*iw;p[3]=iw;
 }
}
void paint(int width,int height,int first,int count,float *vertices,u32 *triangles,float *projected,
 u32 *pixels,float *depth,u32 *ids,u32 *textures,int tw,int th,int quality){
 for(int i=first;i<first+count;i++){
  u32 *t=triangles+i*6;float *a=projected+t[0]*4,*b=projected+t[1]*4,*c=projected+t[2]*4;
  if(a[3]<=0||b[3]<=0||c[3]<=0)continue;
  int x0=clampi(floori(minf(a[0],minf(b[0],c[0]))),0,width-1),x1=clampi(floori(maxf(a[0],maxf(b[0],c[0])))+1,0,width-1);
  int y0=clampi(floori(minf(a[1],minf(b[1],c[1]))),0,height-1),y1=clampi(floori(maxf(a[1],maxf(b[1],c[1])))+1,0,height-1);
  double ax=a[0],ay=a[1],bx=b[0],by=b[1],cx=c[0],cy=c[1];
  double den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);if(den<.0000001&&den>-.0000001)continue;
  double inv=1.0/den,adx=(by-cy)*inv,ady=(cx-bx)*inv,bdx=(cy-ay)*inv,bdy=(ax-cx)*inv;
  double ar=((by-cy)*(x0+.5-cx)+(cx-bx)*(y0+.5-cy))*inv;
  double br=((cy-ay)*(x0+.5-cx)+(ax-cx)*(y0+.5-cy))*inv;
  float *va=vertices+t[0]*6,*vb=vertices+t[1]*6,*vc=vertices+t[2]*6;
  int stride=(4*tw*tw-1)/3,texsize=tw,offset=0;
  u32 *texture=t[4]?textures+(t[4]-1)*stride:textures;
  double dux=adx*(va[3]-vc[3])+bdx*(vb[3]-vc[3]),duy=ady*(va[3]-vc[3])+bdy*(vb[3]-vc[3]);
  double dvx=adx*(va[4]-vc[4])+bdx*(vb[4]-vc[4]),dvy=ady*(va[4]-vc[4])+bdy*(vb[4]-vc[4]);
  double footprint=maxf((dux<0?-dux:dux)+(dvx<0?-dvx:dvx),(duy<0?-duy:duy)+(dvy<0?-dvy:dvy))*tw;
  while(footprint>2&&texsize>1){offset+=texsize*texsize;texsize>>=1;footprint*=.5;}
  texture+=offset;double mipblend=maxf(0,minf(1,footprint-1));
  for(int y=y0;y<=y1;y++,ar+=ady,br+=bdy){
   double aa=ar,bb=br;int p=y*width+x0;
   for(int x=x0;x<=x1;x++,p++,aa+=adx,bb+=bdx){
    double cc=1.0-aa-bb;if(aa<-.00000001||bb<-.00000001||cc<-.00000001)continue;
    double z=aa*a[2]+bb*b[2]+cc*c[2];if(z>=depth[p])continue;
    u32 color=t[3];
    double iw=aa*a[3]+bb*b[3]+cc*c[3];
    if(t[4]){
     double u=(aa*va[3]*a[3]+bb*vb[3]*b[3]+cc*vc[3]*c[3])/iw;
     double v=(aa*va[4]*a[3]+bb*vb[4]*b[3]+cc*vc[4]*c[3])/iw;
     color=sample(texture,texsize,u,v);
     if(mipblend>.01&&texsize>1)color=mixcolor(color,sample(texture+texsize*texsize,texsize>>1,u,v),mipblend);
    }else{
     double shade=(aa*va[5]*a[3]+bb*vb[5]*b[3]+cc*vc[5]*c[3])/iw;u32 out=0xff000000;
     for(int ch=0;ch<3;ch++)out|=((u32)clampi((int)(((color>>(ch*8))&255)*shade),0,255))<<(ch*8);
     color=out;
    }
    pixels[p]=color|0xff000000;depth[p]=z;
    u32 id=t[5];
    if(id<100){
     double wx=(aa*va[0]*a[3]+bb*vb[0]*b[3]+cc*vc[0]*c[3])/iw,wy=(aa*va[1]*a[3]+bb*vb[1]*b[3]+cc*vc[1]*c[3])/iw;
     if(wx>=-6.85&&wx<=6.85&&wy>=.48&&wy<=10.25){int floor=clampi((int)((wy-.48)/2.45),0,3),col=clampi((int)((wx+6.9)/4.6),0,2);id=1+(3-floor)*3+col;}else id=0;
    }ids[p]=id;
   }
  }
 }
}
void draw(int width,int height,int nv,int nt,float *vertices,u32 *triangles,float *matrix,float *projected,
 u32 *pixels,float *depth,u32 *ids,u32 *textures,int tw,int th,int quality,int selected){
 prepare(width,height,nv,vertices,matrix,projected,pixels,depth,ids);
 paint(width,height,0,nt,vertices,triangles,projected,pixels,depth,ids,textures,tw,th,quality);
}
