/* ============================================================
   SELECTED WORKS — your project list (the single source of truth)
   ============================================================

   This one file drives EVERYTHING:
     • the rotating hero background (index.html)
     • the "Selected work" carousel (index.html)
     • the portfolio grid (portfolio.html)
     • each full case-study page (projects/<slug>.html)

   ------------------------------------------------------------
   HOW TO ADD A PROJECT (no new HTML file needed)
   ------------------------------------------------------------
     1. Pick a "slug" — lowercase, hyphens, no spaces (e.g. silent-suites).
        This becomes the page URL and the image folder name.

     2. Make a folder:  Selected-Works/<slug>/
        Drop your case-study images in it using these names
        (any you skip are simply left out of the page):

           cover.jpg       big image at the top of the case study
           sketch.jpg      process step 1
           cad.jpg         process step 2
           prototype.jpg   process step 3
           final.jpg       process step 4
           decisions.jpg   image beside the "Key decisions" text
           outcome.jpg     image in the "Outcome" section
           gallery-1.jpg   (optional) extra images, gallery-2.jpg, etc.

        You do NOT have to list these paths below — the build script
        finds them automatically by looking in the folder. Only set an
        "image" path by hand if a file is named differently.

     3. Keep the thumbnail for the grids in  Selected-Works/  as before
        (e.g. Selected-Works/silent-suites-thumbnail.jpg) and point the
        `image` field at it.

     4. Fill in the text fields below (title, oneLiner, role, brief, …).

     5. Run the build:   node build/generate.js     (or: npm run build)
        This writes projects/<slug>.html for every project.

     6. Commit + push.

   IMPORTANT — paths are case-sensitive once live on GitHub.
   "Selected-Works" has a capital S and capital W. Match filenames exactly.

   ------------------------------------------------------------
   FIELD REFERENCE  (every field except title/slug is optional)
   ------------------------------------------------------------
     slug        URL + image-folder name. REQUIRED, unique.
     title       Project name (bold in grids + case-study cover).
     descriptor  One-line subtitle used in the carousel / grid.
     type        Kind of work, shown on hover in the work section. One of:
                 "Personal Project", "Academic Work", "Professional Work",
                 "Other".
     image       Thumbnail for the grids + hero rotation.
     url         Auto-set to projects/<slug>.html if you leave it off.

     ── Case-study cover ──
     oneLiner    One sentence: what it is + the result.
     role        Your role,   e.g. "Lead Design Engineer".
     client      Client name, or "—" if self-initiated.
     year        e.g. "2025".
     cover       Cover image. Defaults to Selected-Works/<slug>/cover.jpg,
                 then falls back to the thumbnail.

     ── Sections ──
     brief       The problem + hard constraints (a paragraph).
     process     Up to four steps. Defaults to the sketch/cad/prototype/
                 final.jpg files in the folder. Override labels/images here.
     decisions   { text, image } — the technical-depth section.
     outcome     { text, image, metrics:[{label,value}, …] } — results +
                 the stat cards (e.g. Weight saved / Part count / Unit cost).
     gallery     Extra images. Defaults to gallery-*.jpg in the folder.
============================================================ */

const WORKS = [
  {
    slug: "silent-suites",
    title: "Silent Suites",
    descriptor: "Soundproofing Booth Design",
    type: "Academic Work",
    image: "Selected-Works/silent-suites-thumbnail.jpg",

    // ---- Case-study cover ----
    oneLiner: "A modular office phone booth that drops interior noise while shipping flat.",
    role: "Design Engineer",
    client: "—",
    year: "2023",
    // cover: auto → Selected-Works/silent-suites/cover.jpg (falls back to thumbnail)

    // ---- The brief ----
    brief: "Open-plan offices needed a quiet space for calls, but existing booths " +
           "are heavy, expensive to ship, and take time to install. The brief: a " +
           "portable - modular booth that meets a 30 dB sound-reduction target, ships as flat " +
           "panels through a standard doorway, and assembles in less than a day with " +
           "no specialist tools.",

    // ---- Process ----
    // Leave this off entirely to auto-load sketch/cad/prototype/final.jpg.
    // Shown here so you can see the shape / rename a step if you want.
    process: [
      { label: "Sketch",    image: "Selected-Works/silent-suites/sketch.jpg" },
      { label: "CAD",       image: "Selected-Works/silent-suites/cad.jpg" },
      { label: "Prototype", image: "Selected-Works/silent-suites/prototype.jpg" },
      { label: "Final",     image: "Selected-Works/silent-suites/final.jpg" }
    ],

    // ---- Key decisions (the technical depth) ----
    decisions: {
      text: "Two calls shaped the whole design. First, a decoupled double-wall with " +
            "a 40 mm air gap and a mass-loaded vinyl core — chosen over thicker foam " +
            "because the mass-spring-mass system kills the 200–2,000 Hz speech band " +
            "where it matters, at half the weight. Second, a cam-lock panel joint " +
            "instead of screws: FEA showed the corner posts carried the load, so the " +
            "panels could be non-structural and snap together, which is what made the " +
            "flat-pack and 30-minute assembly possible."
      // image: auto → Selected-Works/silent-suites/decisions.jpg
    },

    // ---- Outcome ----
    outcome: {
      text: "The production booth hit 32 dB of reduction — two over target — and " +
            "ships as six flat panels that pass through an 80 cm door.",
      // image: auto → Selected-Works/silent-suites/outcome.jpg
      metrics: [
        { label: "Weight saved", value: "−32%" },
        { label: "Part count",   value: "14 → 6" },
        { label: "Unit cost",    value: "−18%" }
      ]
    }

    // gallery: auto → any Selected-Works/silent-suites/gallery-*.jpg
  },

  {
    slug: "coral-cycles",
    title: "Coral Cycles",
    descriptor: "Transportation Design",
    type: "Academic Work",
    image: "Selected-Works/coral-cycles-thumbnail.jpg",
    oneLiner: "",
    role: "Lead Design Engineer",
    client: "—",
    year: "2023",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

  {
    slug: "safety-by-design",
    title: "Safety By Design",
    descriptor: "Wearable Safety Design",
    type: "Academic Work",
    image: "Selected-Works/safety-by-design-thumbnail.jpg",
    oneLiner: "",
    role: "Lead Design Engineer",
    client: "—",
    year: "2023",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

    {
    slug: "light-shield",
    title: "Light as a Defense Mechanism",
    descriptor: "A case study on product design through design protocols",
    type: "Academic Case Study",
    image: "Selected-Works/light-shield-thumbnail.jpg",
    oneLiner: "A self-defense flashlight used to demonstrate a Design for Safety methodology",
    role: "Designer / Writer",
    client: "Academic Work",
    year: "2025",
    brief: "Most personal-safety devices look like ordinary tools, leaving" +
           " users underserved at the exact moments protection matters most." +
           " This case study reframes a flashlight as a self-defense device," +
           " using it to demonstrate how a Design for Safety (DfS) approach" +
           " embeds user protection from the earliest stages of development." +
           " Rather than chasing spontaneous ideas, the project treats design" +
           " as a methodical, cyclical process driven by structured Design" +
           " Protocols. Each stage, from problem mapping to photorealistic" +
           " modeling, is documented, revisited and refined, turning 'light" +
           " as a defense mechanism' into a coherent, safety-led product proposal.",

    decisions: {
      text: "The methodology unfolds as a sequence of Design Protocols, each" +
            " structuring a different part of the problem. It begins with a" +
            " concept map (mindmap) that defines the design space, answering" +
            " questions such as how a flashlight is used, what mechanisms it" +
            " relies on, and where it sits in relation to the user, while" +
            " capturing every group with a potential stake in the solution." +
            " From there, a Design Motive frames the nature of the problem" +
            " through five lenses: WHO the user is (a civilian, untrained in" +
            " self-defense, a potential theft victim), WHAT motivates them," +
            " WHY the designer is intervening on their behalf, WHEN the product" +
            " is used, and WHERE. This protocol resolves into a single stated" +
            " direction, light as a self-defense mechanism, that anchors every" +
            " decision downstream. A mood board then translates market research," +
            " forms, geometries, materials and textures into one shared visual" +
            " language, while a Risk and Opportunity Map adapts a SWOT analysis" +
            " across four lenses: Safety, Market, Technology and Product." +
            " Crucially, its entries describe the design process rather than the" +
            " product itself; a desirable trait like rapid activation can" +
            " register as a risk because it is difficult to implement reliably," +
            " whereas the observation that most market products resemble" +
            " ordinary flashlights becomes an opportunity for formal and" +
            " mechanical differentiation. With the problem fully mapped," +
            " sketching opens the ideation stage, exploring form, ergonomics," +
            " surface mechanisms and user interaction through story-boards, and" +
            " generating as many candidate solutions as possible. The proposal" +
            " is finalized in CAD using computational and parametric methods," +
            " whose non-destructive, iterative nature allows rapid versioning," +
            " precise technical drawings, and finally a photorealistic render:" +
            " the flashlight shown in operation, illuminating its surroundings," +
            " with a charging port indicating battery level."
    },
    outcome: {
      text: "Applied end to end, the Design Protocols demonstrate that the" +
            " creative process is not a loose collection of ideas but a" +
            " flexible, organized and cyclical path. Through continuous" +
            " reevaluation, systematic documentation and the gradual" +
            " translation of ideas into design proposals, the case study" +
            " yields a product that meets user needs, prioritizes safety, and" +
            " stands out for its functionality and reliability.",
      metrics: [
        { label: "Methodology",      value: "Design for Safety" },
        { label: "Protocols Applied", value: "6" },
        { label: "Final Output",      value: "Photorealistic 3D Model" }
      ]
    }
  },

  {
    slug: "tech-and-touch",
    title: "Tech & Touch",
    descriptor: "Shoe Box Design Study",
    type: "Academic Work",
    image: "Selected-Works/tech-and-touch-thumbnail.jpg",
    oneLiner: "",
    role: "Lead Design Engineer",
    client: "—",
    year: "2023",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

  {
    slug: "from-core-to-casing",
    title: "From Core to Casing",
    descriptor: "An Egg Housing Study",
    type: "Academic Work",
    image: "Selected-Works/from-core-to-casing-thumbnail.jpg",
    oneLiner: "",
    role: "Lead Design Engineer",
    client: "—",
    year: "2023",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

  {
    slug: "guardian-links",
    title: "Guardian Links",
    descriptor: "A Wearable Safety Solution",
    type: "Academic Work",
    image: "Selected-Works/guardian-links-thumbnail.jpg",
    oneLiner: "",
    role: "Lead Design Engineer",
    client: "—",
    year: "2023",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

  {
    slug: "branding-bottlenecks",
    title: "Branding Bottlenecks",
    descriptor: "A Bottle Redesign Study",
    type: "Academic Work",
    image: "Selected-Works/branding-bottlenecks-thumbnail.jpg",
    oneLiner: "",
    role: "Lead Design Engineer",
    client: "—",
    year: "2023",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

  {
    slug: "olympus-patch-packaging",
    title: "Olympus Patch Packaging",
    descriptor: "A patch packaging solution",
    type: "Professional Work",
    image: "Selected-Works/55peaks-patch-packaging-thumbnail.jpg",
    oneLiner: "A packaging solution for 10cm x 7cm embroidery patches",
    role: "Lead Design Engineer",
    client: "55Peaks",
    year: "2026",
    brief: "",
    decisions: { text: "" },
    outcome: { text: "", metrics: [] }
  },

  {
    slug: "olympus-themed-neckgaiter-design",
    title: "Mt Olympus Neckgaiter Design",
    descriptor: "A Mt. Olympus neckgaiter design",
    type: "Professional Work",
    image: "Selected-Works/55peaks-neckgaiter-olympus01-thumbnail.jpg",
    oneLiner: "A neckgaiter design focused on Mt. Olympus - Greece",
    role: "Lead Design Engineer",
    client: "55Peaks",
    year: "2025",
    brief: "Climbing Mt. Olympus leaves a lasting mark. Visitors find plenty of standard" +
           " souvenirs, but missing from the shelves is a piece balancing art with outdoor" +
           " utility. This neck gaiter fills the gap. It features the legendary peaks in flat," +
           " clean colors. The design draws inspiration from the vibrant mountain landscape." +
           " A journey through Olympus National Park deserves a functional, wearable memory.",
    decisions: { 
      text: "The design concept originated from a sunset video captured on Mt. Olympus." +
            " The gradient of the setting sun against the rocky terrain created a color" +
            " palette that was impossible to ignore. In order to translate the video into" +
            " a workable file, the video was deconstructed into individual frames, curated" +
            " the most coherent moments and the stitched together using photobashing techniques." +
            " A master palette was extracted from the video footage to guide the design's" +
            " color system. However, raw footage rarely translates perfectly into a static print." +
            " The colors were right, but the composition required a structural overhaul to ensure" +
            " the flow remained balanced. A new pamoramic photograph was captured to better" +
            " align with the design criteria. The image offers a seamless, wide-angle composition" +
            " suitable for a sylindrical wrap, ensuring the design flows without visual interaption." +
            " Crucially, the high-constrast texture of the raw file serves as an ideal base for the" +
            " selected color palette, allowing the extracted sunset hues to be mapped onto the geometry" +
            " with precision and depth. The canvas is split into levels which will guide the" +
            " re-coloring process of image. The raw capture is translated into flat - vector" +
            " style designs which easily translate into fabric. The levels map the focus and" +
            " color group for the individual elements on the design. Areas of interest are" +
            " designated and isolated to then be merged together into a coherent image. A lot" +
            " attention is paid to the seams of the product, ensuring visual continuity to the" +
            " design. Finally, bleed areas are added to the edges and the design is transformed" +
            " to conform with the manufacturer's requirements."  
    },
    outcome: { text: "The resulting product is part of a limited collection" + 
                     " available at the physical shop 55Peaks in Litohoro Pierias" +
                     " - Greece.", 
      metrics: [
        { label: "Dimesions", value: "46mm x 500mm" },
        { label: "Colors",   value: "Pantone©" },
        { label: "Units sold",    value: "400+" }      
    ] }
  },

  {
    slug: "mytikas-peak-patch-design",
    title: "Mytikas Peak Patch Design",
    descriptor: "Embroidery patch design of Mytikas Summit",
    type: "Professional Work",
    image: "Selected-Works/55Peaks-Mytikas-Design-thumbnail.jpg",
    oneLiner: "An embroidered summit patch for Mytikas - the highest peak of Mt. Olympus, Greece",
    role: "Lead Design Engineer",
    client: "55Peaks",
    year: "2026",
    brief: "Mytikas is the highest peak of Mt. Olympus and the crown of the" +
           " 55Peaks embroidery patch collection - a series celebrating the" +
           " fifty-five named summits of Greece's most storied mountain. Standing" +
           " at 2,918 meters, Mytikas marks the true summit of Olympus, the" +
           " mythological home of the ancient Greek gods. Each patch turns a" +
           " hard-earned ascent into a wearable emblem: a keepsake for the climber" +
           " who reached the top, and a considered souvenir for visitors passing" +
           " through Litochoro, the gateway village to Olympus National Park. The" +
           " Mytikas design distills the peak's jagged limestone ridgeline into a" +
           " clean, flat-color illustration made for embroidery.",
    decisions: { 
      text: "Every patch in the collection begins with a photograph. For Mytikas," +
            " a reference image of the summit was cropped and cleaned to fit the" +
            " vertical patch format - removing distracting elements, correcting the" +
            " framing, and isolating the ridgeline so the peak reads instantly. A" +
            " digital filter was then applied to push the photo toward a midpoint" +
            " between photograph and vector graphic, and the staging was analyzed to" +
            " decide which rock faces and shadows deserved detail and which could be" +
            " flattened. From there, the peak was rebuilt as an SVG. This is where the" +
            " bulk of the design work happens: the summit is redrawn, refined, and" +
            " pushed through multiple iterations until its color and character align" +
            " with the story the patch is meant to tell. Three to four variations were" +
            " presented to the client, one was selected, and that direction was refined" +
            " into the final look. At this stage the illustration can carry up to forty" +
            " distinct colors. Embroidery imposes a hard limit. Manufacturing demands" +
            " fewer than ten thread colors, and the fixed patch elements - outline," +
            " brand mark, peak name, and elevation - already claim four of them. Two" +
            " more are reserved for the sky, leaving roughly four colors to describe the" +
            " entire summit. Black (#000000) is one of them, so the deepest shadows of" +
            " Mytikas collapse into pure black, and the same logic is applied across the" +
            " rest of the illustration to keep the palette tight. Thread also has a" +
            " minimum stitch width. Details below that threshold were enlarged," +
            " neighboring shapes in the same color family were merged, and the design" +
            " was simplified again - a process that can run anywhere from four to ten" +
            " passes depending on how much color and complexity the original held." +
            " Because a single illustration can contain hundreds of shapes, color" +
            " counting is not done by hand. A custom Python script paired with an Excel" +
            " macro generates the color list at each stage, keeping the reduction" +
            " measurable and repeatable. Once the client signs off, the SVG is cleaned" +
            " of overlapping shapes and handed to the manufacturer production-ready."
           },
    outcome: { 
      text: "The Mytikas patch is one of the first three designs from the" +
            " 55Peaks collection to reach production. It is available now on" +
            " the shelves of the 55Peaks store in Litochoro, at the foot of" +
            " Mt. Olympus in Greece.", 
      metrics: [
        { label: "Dimesions", value: "70mm x 100mm" },
        { label: "Thread colors",   value: "6" },
        { label: "Format",    value: "Embroidery patch" }
    ] }
  },

  {
    slug: "skala-peak-patch-design",
    title: "Skala Peak Patch Design",
    descriptor: "Embroidery patch design of Skala Summit",
    type: "Professional Work",
    image: "Selected-Works/55peaks-skala-patch-design-thumbnail.jpg",
    oneLiner: "A neckgaiter design focused on Mt. Olympus - Greece",
    role: "Lead Design Engineer",
    client: "55Peaks",
    year: "2026",
    brief: "Skala is a beautiful peak of Mt. Olympus, rising to 2,882" +
           " meters along the mountain's summit ridge - the classic gateway to" +
           " Mytikas and one of the fifty-five named summits celebrated in the" +
           " 55Peaks embroidery patch collection. This design turns the ascent of" +
           " Skala into a wearable emblem: a keepsake for the climber who stood on" +
           " the ridge, and a considered souvenir for visitors passing through" +
           " Litochoro, the gateway village to Olympus National Park. The Skala" +
           " patch distills the peak's broad, tilted crest and shattered rock into" +
           " a clean, flat-color illustration built for embroidery.",
    decisions: { 
      text: "Every patch in the collection begins with a photograph. For Skala," +
            " a reference image of the summit ridge was cropped and cleaned to fit" +
            " the vertical patch format - removing distracting elements, correcting" +
            " the framing, and centering the peak so it reads instantly. A digital" +
            " filter was then applied to push the photo toward a midpoint between" +
            " photograph and vector graphic, and the staging was analyzed to decide" +
            " which rock faces and shadows deserved detail and which could be" +
            " flattened. From there, the peak was rebuilt as an SVG. This is where" +
            " the bulk of the design work happens: the summit is redrawn, refined," +
            " and pushed through multiple iterations until its color and character" +
            " align with the story the patch is meant to tell. Early rounds tested" +
            " different treatments of the ridge and sky, and client feedback steered" +
            " the direction - a stronger contrast between mountain and sky, warmer" +
            " earthy tones reminiscent of weathered bronze, and a tighter focus on" +
            " the peak itself rather than the surrounding scene. Three to four" +
            " variations were presented, one was selected, and that direction was" +
            " refined into the final look. At this stage the illustration can carry" +
            " up to forty distinct colors. Embroidery imposes a hard limit." +
            " Manufacturing demands fewer than ten thread colors, and the fixed" +
            " patch elements - outline, brand mark, peak name, and elevation -" +
            " already claim four of them. Two more are reserved for the sky, leaving" +
            " roughly four colors to describe the entire summit. Black (#000000) is" +
            " one of them, so the deepest shadows of Skala collapse into pure black," +
            " and the same logic is applied across the rest of the illustration to" +
            " keep the palette tight. Thread also has a minimum stitch width." +
            " Details below that threshold were enlarged, neighboring shapes in the" +
            " same color family were merged, and the design was simplified again - a" +
            " process that can run anywhere from four to ten passes depending on how" +
            " much color and complexity the original held. Because a single" +
            " illustration can contain hundreds of shapes, color counting is not" +
            " done by hand. A custom Python script paired with an Excel macro" +
            " generates the color list at each stage, keeping the reduction" +
            " measurable and repeatable. Once the client signs off, the SVG is" +
            " cleaned of overlapping shapes and handed to the manufacturer" +
            " production-ready." 
    },
    outcome: { 
      text: "The Skala patch is one of the first three designs from the" +
            " 55Peaks collection to reach production. It is available now" +
            " on the shelves of the 55Peaks store in Litochoro, at the foot" +
            " of Mt. Olympus in Greece.", 
      metrics: [
        { label: "Dimesions", value: "70mm x 100mm" },
        { label: "Thread colors",   value: "10" },
        { label: "Format",    value: "Embroidery patch" }
    ]  }
  },

  {
    slug: "skolio-peak-patch-design",
    title: "Skolio Peak Patch Design",
    descriptor: "Embroidery patch design of Skolio Summit",
    type: "Professional Work",
    image: "Selected-Works/55peaks-skolio-patch-design-thumbnail.jpg",
    oneLiner: "An embroidered summit patch for Skala - a peak on the summit ridge of Mt. Olympus, Greece",
    role: "Lead Design Engineer",
    client: "55Peaks",
    year: "2026",
    brief: "Skolio is the third-highest peak of Mt. Olympus, rising to 2,905" +
           " meters on the mountain's summit plateau - one of the fifty-five named" +
           " summits celebrated in the 55Peaks embroidery patch collection. Broad" +
           " and sweeping where Mytikas is jagged, Skolio offers one of the finest" +
           " vantage points over the Olympus range. This design turns the ascent" +
           " into a wearable emblem: a keepsake for the climber who reached the top," +
           " and a considered souvenir for visitors passing through Litochoro, the" +
           " gateway village to Olympus National Park. The Skolio patch distills the" +
           " peak's long, tilted crest and layered rock into a clean, flat-color" +
           " illustration built for embroidery.",
    decisions: { 
      text: "Every patch in the collection begins with a photograph. For Skolio," +
            " a reference image of the summit was cropped and cleaned to fit the" +
            " vertical patch format - removing distracting elements, correcting the" +
            " framing, and centering the peak so it reads instantly. A digital" +
            " filter was then applied to push the photo toward a midpoint between" +
            " photograph and vector graphic, and the staging was analyzed to decide" +
            " which rock faces and shadows deserved detail and which could be" +
            " flattened. From there, the peak was rebuilt as an SVG. This is where" +
            " the bulk of the design work happens: the summit is redrawn, refined," +
            " and pushed through multiple iterations until its color and character" +
            " align with the story the patch is meant to tell. For Skolio, a full" +
            " set of color directions was explored side by side - a cool grey stone" +
            " treatment, a warm earthy bronze, and a cooler blue-tinted variant -" +
            " each also tested with and without a defining outline on the ridgeline." +
            " Client feedback guided the choice toward the warmer, bronze-leaning" +
            " palette and a cleaner read, with redundant tones removed to match the" +
            " restraint of the other patches in the set. Three to four variations" +
            " were presented, one was selected, and that direction was refined into" +
            " the final look. At this stage the illustration can carry up to forty" +
            " distinct colors. Embroidery imposes a hard limit. Manufacturing" +
            " demands fewer than ten thread colors, and the fixed patch elements -" +
            " outline, brand mark, peak name, and elevation - already claim four of" +
            " them. Two more are reserved for the sky, leaving roughly four colors" +
            " to describe the entire summit. Black (#000000) is one of them, so the" +
            " deepest shadows of Skolio collapse into pure black, and the same logic" +
            " is applied across the rest of the illustration to keep the palette" +
            " tight. Thread also has a minimum stitch width. Details below that" +
            " threshold were enlarged, neighboring shapes in the same color family" +
            " were merged, and the design was simplified again - a process that can" +
            " run anywhere from four to ten passes depending on how much color and" +
            " complexity the original held. Because a single illustration can" +
            " contain hundreds of shapes, color counting is not done by hand. A" +
            " custom Python script paired with an Excel macro generates the color" +
            " list at each stage, keeping the reduction measurable and repeatable." +
            " Once the client signs off, the SVG is cleaned of overlapping shapes" +
            " and handed to the manufacturer production-ready." 
          },
    outcome: { 
      text: "The Skolio patch is one of the first three designs from the" +
            " 55Peaks collection to reach production. It is available now" +
            " on the shelves of the 55Peaks store in Litochoro, at the foot" +
            " of Mt. Olympus in Greece.", 
      metrics: [
        { label: "Dimesions", value: "70mm x 100mm" },
        { label: "Thread colors",   value: "10" },
        { label: "Format",    value: "Embroidery patch" }
    ]  }
  }
];

/* ------------------------------------------------------------
   Make WORKS available to the Node build script as well as the
   browser. In the browser, `module` is undefined and this is
   skipped — the carousel/grid keep reading the global WORKS.
------------------------------------------------------------ */
if (typeof module !== "undefined" && module.exports) {
  module.exports = WORKS;
}
