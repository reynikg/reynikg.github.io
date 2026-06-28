/* ============================================================
   ABOUT PAGE CONTENT — the single source of truth for about.html
   ============================================================

   The "About" page below the intro is built entirely from this file
   by js/about.js. Each section becomes a collapsible accordion panel
   (all start closed; the visitor opens the ones they want).

   ------------------------------------------------------------
   HOW TO EDIT
   ------------------------------------------------------------
     • Change text  → edit the strings below.
     • Add an entry → copy a { ... } block inside a section's `items`.
     • Add a section→ copy a whole section { ... } block into `sections`.
     • Reorder      → move blocks up/down; the page follows this order.
     • Start a section open by default → set  open: true.

   ------------------------------------------------------------
   ENTRY FIELDS  (everything except `title` is optional)
   ------------------------------------------------------------
     title       Bold first line (role, degree, award, …).
     subtitle    Lighter second line (institution, company, place).
     meta        Right-aligned note — usually a date or period.
     detail      A single paragraph of description.
     details     A bullet list — use INSTEAD of `detail`:
                   details: ["First point", "Second point"]
     links       Articles / sources tied to the entry:
                   links: [{ label: "Read the article", url: "https://…" }]

   ------------------------------------------------------------
   SECTION FIELDS
   ------------------------------------------------------------
     title       The header shown on the accordion.
     open        true = expanded on load (default false).
     layout      "list" (default) renders items as entries.
                 "tags" renders a flat row of pills — used for Skills.
     items       The entries (for layout "list").
     tags        Array of strings (for layout "tags").
============================================================ */

const ABOUT = {
  sections: [

    /* ---------------- 1 · EDUCATION ---------------- */
    {
      title: "Education",
      open: false,
      items: [
        {
          title: "PhD Candidate — Product & System Design Engineering",
          subtitle: "University of Western Macedonia (Polytechnic) — Kozani, Greece",
          meta: "2026 – today",
          detail: "Computational and biomechanical prosthetics design: developing an integrated framework for personalised optimisation and manufacturing."
        },
        {
          title: "Integrated Master's in Product Design & Manufacturing",
          subtitle: "University of Western Macedonia (Polytechnic) — Kozani, Greece",
          meta: "2019 – 2024",
          details: [
            "Bachelor in Product and System Design Engineering, with an integrated Master's.",
            "Dissertation: “Computational Design of Unmanned Surface Vessels (USV)” — integrating computational and algorithmic design into the product-design cycle.",
            "Graduated with honours — Commendation (8.71)."
          ]
        },
        {
          title: "High School Graduate",
          subtitle: "Art School of Thessaloniki — Thessaloniki, Greece",
          meta: "June 2019"
        }
      ]
    },

    /* ---------------- 2 · PROFESSIONAL EXPERIENCE ---------------- */
    {
      title: "Professional Experience",
      open: false,
      items: [
        {
          title: "Apparel & Graphic Designer",
          subtitle: "55Peaks — Litohoro, Greece",
          meta: "2025 - 2026",
          details: [
            "Designed original visuals for neckwear accessories (BUFF), tailored to the aesthetics of the shop's private collection.",
            "Currently developing a series of patches — responsible for concept curation and preparation of production files."
          ]
        },
        {
          title: "Laboratory Assistant (Part-Time)",
          subtitle: "Rehabline, Central Macedonia Branch — Thessaloniki, Greece",
          meta: "2020 – 2025",
          details: [
            "Hands-on experience in the fabrication of prosthetic and orthotic devices, focusing on material properties and workshop safety protocols.",
            "Supported the design and manufacturing of laboratory products, becoming familiar with specialised tools, machines and methodologies."
          ]
        },
        {
          title: "Freelance Product & Graphic Designer",
          subtitle: "Abel Oil Tools — Houston, Texas, USA",
          meta: "2023",
          details: [
            "Designed informational booklets and technical brochures presenting and promoting the company's industrial equipment.",
            "Created corporate letterheads and collateral material, ensuring the visual consistency of the corporate identity."
          ]
        },
        {
          title: "Design & Archival Assistant",
          subtitle: "George Tsaras's Sculpture Studio — Thessaloniki, Greece",
          meta: "2020 – 2021",
          details: [
            "Organised, digitised and archived artwork across 12 separate projects, and designed presentation catalogues in printed and digital formats.",
            "Created specialised graphic materials supporting proposals for portfolio submissions to cultural institutions and competitions."
          ]
        },
        {
          title: "Residential Assistant (RA)",
          subtitle: "Anatolia College Summer Program (CTY) — Thessaloniki, Greece",
          meta: "2019",
          details: [
            "Supervised and guided students (ages 12–16) within a summer STEM educational program.",
            "Coordinated daily on-campus activities and ensured a safe, collaborative living environment for participants."
          ]
        }
      ]
    },

    /* ---------------- 3 · CERTIFICATIONS (incl. Languages) ---------------- */
    {
      title: "Certifications",
      open: false,
      items: [
        {
          title: "Languages",
          details: [
            "Greek — Greek Citizenship (Native)",
            "English — American Citizenship (C2 Proficiency (Michigan University Certification))",
            "Mandarin Chinese — B1 (HSK, Confucius Institute)"
          ]
        },
        {
          title: "Grade 4 Certificate in Modern Dancing",
          subtitle: "ISTD — Imperial Society of Teachers of Dancing",
          meta: "2013"
        }
      ]
    },

    /* ---------------- 4 · PARTICIPATIONS ---------------- */
    {
      title: "Participations",
      open: false,
      items: [
        {
          title: "Invited Speaker — Packaging Design Seminar",
          subtitle: "“Methodologies and tools used in packaging projects”",
          meta: "August 2024"
        },
        {
          title: "Article Author — Design Society",
          subtitle: "“Design for Safety”",
          meta: "December 2024",
          links: [{ label: "designsociety.gr", url: "https://designsociety.gr/post/fos-os-mixanismos-autoamynas_1261" }]
        },
        {
          title: "Johns Hopkins CTY — Summer Programs",
          meta: "2015 – 2016",
          details: [
            "Residential Summer Program in Engineering — 2016",
            "Robotics & Artificial Intelligence Seminar — 2015",
            "Cryptology Seminar — 2015"
          ]
        },
        {
          title: "Anatolia College — Summer Programs",
          meta: "2017 – 2018",
          details: [
            "Summer College Course in Game Design — 2018",
            "Summer Course in Robotics & Artificial Intelligence — 2017"
          ]
        },
        {
          title: "Competitions & Awards",
          details: [
            "3rd Student Robotics Festival — 1st Place (2016)",
            "Creative Writing Competition — Distinction, Short Story (2018)",
            "Panhellenic Student Poetry Competition — Distinction (2016)",
            "Panhellenic Literary Poetry Competition, Union of Greek Writers — 1st Place (2013)"
          ]
        }
      ]
    },

    /* ---------------- 5 · DESIGN WORK ---------------- */
    {
      title: "Design Work",
      open: false,
      items: [
        {
          title: "Cover-page Design — Allpack Hellas",
          subtitle: "Cover-page Design Team Member · Multiple contributions",
          links: [{ label: "allpackhellas.gr", url: "https://www.allpackhellas.gr/teychi/" }],
          details: [
            "Issue #133 - March - April 2026",
            "Issue #129 — July – August 2025",
            "Issue #128 — May – June 2025",
            "Issue #127 — March – April 2025",
            "Issue #124 — September – October 2024",
            "Issue #121 — March – April 2024"
          ]
        }
      ]
    },

    /* ---------------- 6 · SKILLS (flat pills, like the picture) ---------------- */
    {
      title: "Skills",
      open: false,
      layout: "tags",
      tags: [
        "Parametric Design",
        "Algorithmic Design",
        "Generative Design",
        "Computational Design",
        "Visual Scripting",
        "Python",
        "Rhinoceros 3D",
        "Grasshopper",
        "Autodesk Inventor",
        "Autodesk Fusion 360",
        "Blender 3D",
        "Affinity Suite",
        "Microsoft Office Suite",
        "Prototyping",
        "Packaging Design",
        "Graphic Design",
        "Research Methodology",
        "Project Management",
        "Design & Critical Thinking",
        "Public Speaking & Presentation",
        "Proposal Preparation",
        "Teamwork"
      ]
    }

  ],

  /* ---------------- Closing notes (shown under all sections) ---------------- */
  notes: [
    "Military service completed on: October 2025",
    "References available upon request."
  ]
};

/* Make ABOUT available to Node too (browser ignores this). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = ABOUT;
}
