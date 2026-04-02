export type LocaleCode = "en" | "de";

export type LandingDictionary = {
  nav: {
    expertise: string;
    about: string;
    work: string;
    contact: string;
    liveDemo: string;
  };
  headerCta: string;
  a11y: {
    logoToHome: string;
    openMenu: string;
    closeMenu: string;
    githubProfile: string;
  };
  hero: {
    kicker: string;
    title: string;
    /** Second headline line inside the same `<h1>` (gradient). */
    titleLine2: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    eyebrow: string;
    title: string;
    body: string;
    cards: readonly { title: string; description: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    altText: string;
    figcaptionSub: string;
    pills: readonly string[];
  };
  projects: {
    title: string;
    intro: string;
    tagline: string;
    caseStudy: string;
    viewOnGithub: string;
    restrictedAccess: string;
    legalNote: string;
    demoIntro: string;
    /** Distinct from `nav.liveDemo` to avoid redundant same-text links to `/demo/market-analytics`. */
    demoCta: string;
    featured: readonly {
      role: string;
      name: string;
      summary: string;
      outcome: string;
      tags: readonly string[];
      githubUrl?: string;
    }[];
  };
  opSec: {
    title: string;
    intro: string;
    items: readonly { title: string; body: string }[];
  };
  legalFooter: {
    impressum: string;
    privacy: string;
  };
  form: {
    name: string;
    email: string;
    message: string;
    serviceLabel: string;
    servicePlaceholder: string;
    serviceOptions: {
      web_arch: string;
      three_js: string;
      ai_automation: string;
      security_audit: string;
      data_quant: string;
      other: string;
    };
    /** Text before the privacy-policy link in the consent label. */
    consentLead: string;
    /** Linked phrase (e.g. Datenschutzerklärung / Privacy policy). */
    consentPrivacyLinkText: string;
    /** Text after the link (revocation notice, channels). */
    consentTrail: string;
    consentError: string;
    submit: string;
    sending: string;
    success: string;
  };
  contact: {
    title: string;
    body: string;
    writtenContactLead: string;
  };
  impressum: {
    htmlBody: string;
    eyebrow: string;
    title: string;
    nameLine: string;
    brandLine: string;
    streetLine: string;
    cityLine: string;
    contactHeading: string;
    phoneLine: string;
    emailLabel: string;
    jobHeading: string;
    jobSubLabel: string;
    jobBody: string;
    editorialHeading: string;
    editorialName: string;
    disputeHeading: string;
    disputeBody: string;
    kleinunternehmerTitle: string;
    kleinunternehmerBody: string;
    disclaimer: string;
    backHome: string;
    downloadPdf: string;
  };
  datenschutz: {
    htmlBody: string;
    eyebrow: string;
    title: string;
    stand: string;
    emailLabel: string;
    s1Title: string;
    s1Lead: string;
    s2Title: string;
    s2p1: string;
    s2p2: string;
    s2p3: string;
    s3Title: string;
    s3p1: string;
    s4Title: string;
    s4p1: string;
    s5Title: string;
    s5p1: string;
    s6Title: string;
    s6p1: string;
    backHome: string;
    downloadPdf: string;
  };
};
