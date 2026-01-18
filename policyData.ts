
export interface PolicyCategory {
    id: string;
    title: string;
    desc: string;
    items: string[];
}

export const YOUTUBE_POLICIES: PolicyCategory[] = [
    {
        id: "community-guidelines",
        title: "Community Guidelines",
        desc: "Core rules on what content is allowed on YouTube.",
        items: [
            "Violence & Dangerous Content: No realistic violence or encouragement of harm.",
            "Hate Speech: No content promoting violence/hatred against protected groups.",
            "Harassment & Cyberbullying: No predatory behavior or persistent insults.",
            "Sexual Content: No nudity or sexually explicit material.",
            "Child Safety: Strict protection for minors (COPPA compliance).",
            "Spam & Scams: No deceptive practices or misleading metadata."
        ]
    },
    {
        id: "tos",
        title: "Terms of Service (ToS)",
        desc: "Legal agreement between you and YouTube.",
        items: [
            "Account usage rules",
            "Service misuse (strictly forbidden)",
            "Termination rules for repeated violations"
        ]
    },
    {
        id: "copyright",
        title: "Copyright Policy",
        desc: "Rules regarding intellectual property.",
        items: [
            "Copyright Strike: Consequences of using unlicensed material.",
            "Content ID: Automated matching of copyrighted content.",
            "Fair Use: Legal doctrine for limited use of material.",
            "Reused Content: High threshold for original commentary/value."
        ]
    },
    {
        id: "monetization",
        title: "Monetization Policies",
        desc: "Rules for making money on YouTube.",
        items: [
            "Advertiser-friendly content: No swearing, violence, or sensitive topics for ads.",
            "Reused content policy: Significant creative difference required.",
            "Repetitious content policy: No mass-produced or templated content.",
            "Ineligible content rules: Non-original or low-value content."
        ]
    },
    {
        id: "ypp",
        title: "Partner Program (YPP)",
        desc: "Eligibility for the monetization program.",
        items: [
            "1,000 subscribers required.",
            "4,000 watch hours (long form) or 10M Shorts views (last 90 days).",
            "Full compliance with all platform policies."
        ]
    },
    {
        id: "api-services",
        title: "API Services Policy",
        desc: "Rules for developers using YouTube Data API.",
        items: [
            "YouTube Data API v3 compliance.",
            "Data storage & display rules: No caching for more than 30 days.",
            "API misuse: No selling or unauthorized access."
        ]
    },
    {
        id: "developer-policies",
        title: "Developer Policies",
        desc: "For app and website developers.",
        items: [
            "API quota rules: Respecting usage limits.",
            "Branding requirements: Correct use of YouTube logos.",
            "User data protection: Privacy-first approach."
        ]
    },
    {
        id: "privacy",
        title: "Privacy Guidelines",
        desc: "Handling of user and creator data.",
        items: [
            "Personal data protection: No Doxxing.",
            "Consent rules: Permission for recording others.",
            "Data sharing restrictions."
        ]
    },
    {
        id: "ads",
        title: "Ads Policies",
        desc: "Rules for invalid traffic and fraud prevention.",
        items: [
            "Invalid traffic: No bot views or self-clicking.",
            "Click fraud: Encouraging users to click ads.",
            "Ad placement: No overlapping or deceptive ads."
        ]
    },
    {
        id: "live-streaming",
        title: "Live Streaming Policies",
        desc: "Real-time content rules.",
        items: [
            "Live chat abuse: No spam in chat.",
            "Stream delay rules: Handling sensitive content.",
            "Copyright in live: Real-time copyright enforcement."
        ]
    },
    {
        id: "shorts",
        title: "Shorts Policies",
        desc: "Rules for short-form content.",
        items: [
            "Original content: No re-uploading other people's Shorts without value.",
            "Music usage: Correct licensing via Shorts library.",
            "Monetization eligibility: High engagement required."
        ]
    },
    {
        id: "contests",
        title: "Contest & Promotion Policies",
        desc: "Giving things away on YouTube.",
        items: [
            "Official rules must be provided.",
            "No encouraging illegal activity.",
            "YouTube is not a sponsor."
        ]
    },
    {
        id: "spam-scam",
        title: "Spam, Scam & Deceptive Practices",
        desc: "Anti-fraud measures.",
        items: [
            "Fake views: No buying views or subscribers.",
            "Bots: No automated interaction.",
            "Misleading activity: Bait-and-switch content."
        ]
    },
    {
        id: "election-integrity",
        title: "Election Integrity Policy",
        desc: "Rules for political and election-related content.",
        items: [
            "No foreign interference promotion.",
            "No misleading information about polling locations/times.",
            "Transparency in political advertising."
        ]
    },
    {
        id: "child-safety-coppa",
        title: "Child Safety & COPPA",
        desc: "Strict legal protection for children (Children's Online Privacy Protection Act).",
        items: [
            "Marking content as 'Made for Kids'.",
            "No targeted ads on kids content.",
            "No comments on videos made for children."
        ]
    }
];

export const PROHIBITED_ACTIVITIES = [
    "Paid watch / auto watch (Strictly Forbidden)",
    "Fake views, likes, comments (Buying engagement)",
    "Bot traffic (Automated interaction)",
    "Misleading earning apps / scams",
    "Template/Repetitious content without value"
];
