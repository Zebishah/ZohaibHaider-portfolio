/** Central links — update LinkedIn if your profile slug differs */
export const socials = {
  github: "https://github.com/Zebishah",
  linkedin:
    import.meta.env.VITE_LINKEDIN_URL ?? "https://www.linkedin.com/in/zohaib-haider",
  email: "zebihaider123@gmail.com",
  emailHref: "mailto:zebihaider123@gmail.com",
  phone: "+92 310 5904269",
  phoneHref: "tel:+923105904269",
  /** Served from /public/resume.pdf */
  resume: "/resume.pdf",
  resumeDownloadName: "Zohaib_Haider_Resume.pdf",
} as const;
