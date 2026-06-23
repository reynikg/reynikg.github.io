/* ============================================================
   ARTICLES — your writing list (the single source of truth)
   ============================================================

   This one file drives EVERYTHING about the Writing section:
     • the article index list (writing.html)
     • each full article page (writing/<slug>.html)

   It works exactly like data/works.js does for projects: you edit
   data here, run the build, and the HTML pages are generated for you.
   You never hand-write an article page.

   ------------------------------------------------------------
   HOW TO ADD AN ARTICLE
   ------------------------------------------------------------
     1. Pick a "slug" — lowercase, hyphens, no spaces
        (e.g. clickable-grasshopper-geometry). This becomes the page
        URL (writing/<slug>.html) and the image-folder name.

     2. (If the article has images) make a folder:
            writing/<slug>/
        Drop images in it. The cover goes at:
            writing/<slug>/cover.jpg     (jpg / png / webp all fine)
        Body images can be named anything; you reference them by
        filename in the body blocks below (see the "image" block).

     3. Add a new object to the ARTICLES array at the BOTTOM of this
        file (newest goes last — the index shows newest first).

     4. Run the build:   node build/generate-articles.js
        (or build everything:  npm run build)
        This writes writing/<slug>.html.

     5. Commit + push.

   IMPORTANT — paths are case-sensitive once live on GitHub.

   ------------------------------------------------------------
   FIELD REFERENCE   (only slug + title are strictly required)
   ------------------------------------------------------------
     slug         URL + image-folder name. REQUIRED, unique.
     title        The <h1> and the index card title. REQUIRED.
     tag          Category pill. One of: "research" | "tutorial" | "studio".
     date         ISO date "YYYY-MM-DD". Shown as the publish date and
                  used for the article's structured data.
     updated      (optional) ISO date of the last meaningful edit.

     ── SEO / GEO (search + AI-answer optimisation) ──
     description  1–2 sentences, ~150–160 chars. This is the meta
                  description AND the BLUF used by search engines and AI
                  answer engines. Lead with the answer. REQUIRED for good
                  ranking. (See the private SEO-GEO-GUIDE for how to write it.)
     keywords     (optional) array of focus phrases, e.g.
                  ["grasshopper", "rhino", "select mesh face"].
     seoTitle     (optional) override for the <title> tag if you want it to
                  differ from `title` (e.g. add a keyword). Keep < 60 chars.

     ── Card (writing.html index) ──
     excerpt      One-sentence teaser for the index list. Falls back to
                  `description` if omitted.

     ── The article itself (the template) ──
     readingTime  (optional) override the auto-calculated "X min read".
                  Leave it off — the build counts words for you.
     intro        The opening paragraph(s) BEFORE the TL;DR. Blank lines
                  start new paragraphs. KEPT FOR EVERY ARTICLE.
     tldr         The abstract. Rendered as a callout box headed "TL;DR".
                  KEPT FOR EVERY ARTICLE. Lead with the takeaway (BLUF).
     cover        { src, alt }  The image shown right after the TL;DR.
                  `src` is a filename inside writing/<slug>/ (e.g.
                  "cover.jpg") or a full path. `alt` is REQUIRED for SEO +
                  accessibility — describe the image factually.

     body         An ARRAY OF BLOCKS — the flexible part. Order is exactly
                  how the page renders, so you can interleave text and
                  images freely (paragraph → image → paragraph → …).
                  A plain string is shorthand for a paragraph.
                  Block types:
                    "paragraph"  { type:"paragraph", text:"…" }  (or just a string)
                    "heading"    { type:"heading", level:2, text:"…" }  (level 2 or 3)
                    "image"      { type:"image", src:"diagram.png",
                                   alt:"…", caption:"…"(optional) }
                    "list"       { type:"list", ordered:false, items:["…","…"] }
                    "code"       { type:"code", language:"python", code:"…" }
                                 (code is OPTIONAL — most articles won't have it)

     faq          (optional but recommended) array of { q, a }. Rendered as
                  a Q&A block AND emitted as FAQ structured data, which is
                  what gets you into AI answers and "People also ask".
                  KEPT FOR EVERY ARTICLE that can support it.

     references   (optional) array of { label, url }. Rendered as a small
                  sources line at the foot of the article.
   ============================================================ */

const ARTICLES = [

  {
    slug: "clickable-grasshopper-geometry",
    title: "Clickable Grasshopper Geometry: A Python Face Selector for Rhino",
    tag: "tutorial",
    date: "2026-06-23",

    seoTitle: "Click & Select Grasshopper Mesh Faces in Rhino (Python)",
    description:
      "Select Grasshopper mesh faces directly in the Rhino viewport without baking. A Python component casts a camera ray on each click and returns the picked face indices, mask, and preview mesh.",
    keywords: [
      "grasshopper",
      "rhino",
      "select mesh face",
      "rhinocommon",
      "mousecallback",
      "ray mesh intersection",
      "python component",
      "without baking",
    ],
    excerpt:
      "A small Python component that lets you click faces of live Grasshopper geometry straight in the Rhino viewport — no baking, fully parametric, Mac and Windows.",

    intro:
      "Selecting geometry that Grasshopper generates — clicking a mesh face directly in the Rhino viewport — normally isn't possible without baking. For a recent project I needed exactly that: the ability to select objects created by the Grasshopper preview while staying inside a live, parametric definition. Baking wouldn't cut it, because once geometry is baked it can't easily interact with the rest of the Grasshopper script. And because of the way Grasshopper draws things on the screen, the geometry it creates exists... but not really.\n\nSo I wrote a small Python component that lets you select faces — for this project I wanted to pick certain faces on a mesh — straight in the Rhino viewport and feed those selections back into a live Grasshopper definition. It uses RhinoCommon's mouse callback and ray–mesh intersection, and it runs on both macOS and Windows.",

    tldr:
      "Grasshopper geometry is just a preview, so you can't normally select it without baking. This component listens for mouse clicks in the Rhino viewport, shoots a ray from the camera through the click point, finds the first mesh face it hits, and toggles that face in or out of a selection list. The selection comes back out of the component as indices, a boolean mask, and a preview mesh you can keep building with.",

    cover: {
      src: "cover.jpg",
      alt: "A shaded Grasshopper mesh in the Rhino viewport with several faces highlighted as a selection.",
    },

    body: [
      { type: "heading", level: 2, text: "Why you can't normally click Grasshopper geometry" },
      "To understand the problem, you have to understand where Grasshopper geometry actually lives.",
      "Grasshopper is a parametric environment that sits on top of Rhino. When your definition runs, every mesh, surface, and curve it produces exists in memory and is painted into the Rhino viewport as a temporary preview. It looks completely real. You can orbit around it, you can see it shaded. But it is not a Rhino object. It has no place in the Rhino document, no object ID, nothing the rest of Rhino can grab onto.",
      "That has two consequences that matter here. First, you can't select it. Rhino's normal selection tools, snaps, and gumball only work on real document objects, and preview geometry is not one of them. Second, it's ephemeral. Every time the definition recomputes, the old preview is thrown away and a fresh one is drawn. There's nothing stable to hold a selection against.",
      "The usual escape hatch is to bake the geometry, which copies the preview into the Rhino document as a permanent object you can finally click. But baking severs the parametric link. The baked mesh no longer updates when you change a slider, and now you're managing a static copy by hand. For anything interactive, that defeats the point.",

      { type: "heading", level: 2, text: "The project that started it: faces as attractors" },
      "The specific need to create this script came from a recent project — recent relative to when this was written, anyway. I wanted the ability to choose faces on a 3D model and use those faces as attractors: anchor points that drive a generated pattern. Geometry near the chosen faces gets one treatment, geometry further away gets another, and the pattern falls out of that distance relationship.",
      "For that to work, I needed to manually pick the faces directly on the model. Typing in face indices by hand is tedious and time-consuming, which completely kills the \"it's a design tool\" feeling I wanted. It also made it hard to produce many iterations quickly, and unless you already knew Grasshopper and the underlying algorithm, the process wasn't intuitive. I wanted a real clicking method.",

      { type: "heading", level: 2, text: "The core idea: cast a ray from the camera" },
      "The theoretical model is simple. You activate the script within Grasshopper, and when you click somewhere on the Rhino viewport, you're actually pointing into 3D space along a line that starts at the camera and goes straight through the pixel you clicked. Whatever face that line hits first is the face you meant to pick.",
      "The plan was: project a line from the Rhino camera through the click point, find the first face of the Grasshopper mesh it crosses, and toggle that face into a selection list. Click it again to remove it.",

      { type: "heading", level: 2, text: "How the script works" },
      { type: "heading", level: 3, text: "Step 01: Remember things between solves" },
      "Grasshopper components are stateless by default — they forget everything once they finish solving. To hold onto a selection across recomputes, the script stores its data in Rhino's `sticky` dictionary, a small persistent store that survives between solutions. The current selection set, a debug log, and the live mesh all get parked there so they outlive any single run.",
      { type: "heading", level: 3, text: "Step 02: Listen for clicks" },
      "The center of the script is a mouse callback — a class built on RhinoCommon's `MouseCallback` that quietly watches the viewport. When you press the left mouse button, it wakes up and does its work; it ignores everything else. This callback is what lets the component react to the viewport without you having to re-run anything.",
      { type: "heading", level: 3, text: "Step 03: Turn a 2D click into a correctly aimed 3D ray" },
      "On a click, the script grabs the click's screen coordinates and converts them into a line in world space using the viewport's `ClientToWorld`. That gives a line punching from the screen into the scene.",
      "There's a catch: a hollow mesh has a front wall and a back wall, and a naive ray can accidentally report the back one. To avoid that, the script checks which end of the world-space line is closer to the camera, starts the ray there, and points it toward the far end. That guarantees the first hit is the face actually facing you, not the inside of the far wall. This was the detail that made selection feel correct instead of random.",
      { type: "heading", level: 3, text: "Step 04: Find the face" },
      "The ray is intersected against the mesh. If it connects, the script gets the hit point, asks the mesh for the closest face to that point, and reads back that face's index — its position in the mesh's list of faces.",
      { type: "heading", level: 3, text: "Step 05: Toggle the selection" },
      "If the hit face is already selected, clicking removes it; if it isn't, clicking adds it. Simple on/off, which is exactly what you want for picking and un-picking faces by hand.",
      { type: "heading", level: 3, text: "Step 06: Nudge the definition to update" },
      "Finally, it schedules a recompute a few milliseconds later so the component's outputs refresh with the new selection. Scheduling it (rather than recomputing immediately) keeps things from spiraling into an endless solve loop.",

      { type: "heading", level: 2, text: "Inputs and Outputs" },
      "The component is deliberately small. Three inputs, four outputs.",
      { type: "heading", level: 3, text: "Inputs" },
      {
        type: "list",
        ordered: false,
        items: [
          "**Mesh** — the target geometry you want to select faces on. This is the Grasshopper mesh the ray gets tested against.",
          "**Reset** — a button that clears the current selection and wipes the log, so you can start picking from scratch.",
          "**Enable** — a toggle that turns the whole thing on and off. The mouse callback is always-on by nature, so this matters: when you're done selecting, flip it off so the script isn't quietly listening for clicks and burning cycles in the background.",
        ],
      },
      { type: "heading", level: 3, text: "Outputs" },
      {
        type: "list",
        ordered: false,
        items: [
          "**Debug** — a running readout of what the script is doing: whether it's enabled, how many faces the mesh has, whether the callback is active, how many faces are selected, and details of the last click. This is what you watch when something isn't behaving.",
          "**SelectedFaces** — a preview mesh containing only the faces you've selected. It's built by duplicating the input mesh and deleting everything you didn't pick, so you can pipe it straight into the rest of your definition.",
          "**SelectedMask** — a list of true/false values, one per face in the mesh, marking which faces are selected. Handy whenever you need a per-face on/off pattern to drive other logic.",
          "**SelectedIndices** — the sorted list of selected face indices. The plainest form of the selection, useful for referencing faces directly or feeding them into an attractor setup.",
        ],
      },

      { type: "heading", level: 2, text: "Mac and Windows" },
      "I wrote this so it runs on both macOS and Windows. It leans on Rhino's cross-platform mouse callback rather than any OS-specific window hooks, so the same definition behaves the same whether you're on a Mac or a PC.",

      { type: "heading", level: 2, text: "Code" },
      "Here's the full component:",
      {
        type: "code",
        language: "python",
        code: `import Rhino
import Rhino.UI
import Rhino.Geometry as rg
import Grasshopper as gh
import scriptcontext as sc

S_SEL, S_CB, S_LOG, S_MSH = "fp_selected", "fp_callback", "fp_log", "fp_mesh"
comp = ghenv.Component

# --- reset / init ---
if Reset:
    old = sc.sticky.get(S_CB)
    if old is not None:
        old.Enabled = False
    sc.sticky[S_CB] = None
    sc.sticky[S_SEL] = set()
    sc.sticky[S_LOG] = ["reset"]
if S_SEL not in sc.sticky: sc.sticky[S_SEL] = set()
if S_LOG not in sc.sticky: sc.sticky[S_LOG] = ["no click yet"]

sc.sticky[S_MSH] = Mesh   # keep live mesh available to the callback

def _recompute(d):
    comp.ExpireSolution(False)

# --- the mouse callback ---
class FacePicker(Rhino.UI.MouseCallback):
    def OnMouseDown(self, e):
        try:
            if e.MouseButton != Rhino.UI.MouseButton.Left:
                return
            mesh = sc.sticky.get(S_MSH)
            if mesh is None:
                return
            log = []
            vp = e.View.ActiveViewport
            vpt = e.ViewportPoint
            log.append("viewport pt: (%d, %d)" % (vpt.X, vpt.Y))
            line = vp.ClientToWorld(rg.Point2d(vpt.X, vpt.Y))
            # anchor the ray at the camera so the FIRST hit is the face
            # facing the viewer, not the back wall of the hollow mesh
            cam = vp.CameraLocation
            a, b = line.From, line.To
            origin, target = (a, b) if a.DistanceTo(cam) <= b.DistanceTo(cam) else (b, a)
            ray = rg.Ray3d(origin, target - origin)
            t = rg.Intersect.Intersection.MeshRay(mesh, ray)
            if isinstance(t, tuple):
                t = t[0]
            log.append("ray t: %s" % t)
            if t is not None and t >= 0.0:
                mp = mesh.ClosestMeshPoint(ray.PointAt(t), 0.0)
                fi = mp.FaceIndex if mp else -1
                log.append("hit face: %d" % fi)
                if fi != -1:
                    sel = sc.sticky.get(S_SEL, set())
                    if fi in sel: sel.discard(fi)
                    else: sel.add(fi)
                    sc.sticky[S_SEL] = sel
            else:
                log.append("no hit - ray missed")
            sc.sticky[S_LOG] = log
            doc = comp.OnPingDocument()
            if doc is not None:
                doc.ScheduleSolution(5,
                    gh.Kernel.GH_Document.GH_ScheduleDelegate(_recompute))
        except Exception as ex:
            sc.sticky[S_LOG] = ["CALLBACK ERROR: %r" % ex]

# --- enable / disable ---
cb = sc.sticky.get(S_CB)
if Enable:
    if cb is None:
        cb = FacePicker()
        sc.sticky[S_CB] = cb
    cb.Enabled = True
elif cb is not None:
    cb.Enabled = False

# --- outputs ---
sel = sc.sticky.get(S_SEL, set())
SelectedIndices = sorted(sel)
SelectedMask, SelectedFaces = [], None
Debug = ["Enable: %s" % Enable,
         "Mesh in: %s  faces: %s" % (Mesh is not None, Mesh.Faces.Count if Mesh else 0),
         "Callback on: %s" % (sc.sticky.get(S_CB).Enabled if sc.sticky.get(S_CB) else False),
         "Selected: %d" % len(sel),
         "--- last click ---"] + sc.sticky.get(S_LOG, [])

if Mesh is not None:
    SelectedMask = [(i in sel) for i in range(Mesh.Faces.Count)]
    if sel:
        try:
            prev = Mesh.DuplicateMesh()
            prev.Faces.DeleteFaces([i for i in range(prev.Faces.Count) if i not in sel])
            prev.Compact()
            SelectedFaces = prev
        except Exception as ex:
            Debug.append("preview error: %r" % ex)`,
      },
    ],

    faq: [
      {
        q: "Can you select Grasshopper geometry without baking it?",
        a: "Not with Rhino's standard tools. Grasshopper preview geometry isn't a real Rhino document object, so snaps, the gumball, and normal selection don't apply to it. The way around it is to build the interaction inside the definition — like this component does — by listening for viewport clicks and resolving them to faces yourself, which keeps everything parametric and avoids baking.",
      },
      {
        q: "How do you select a mesh face directly in the Rhino viewport?",
        a: "Convert the 2D click into a 3D ray that starts at the camera and passes through the clicked pixel, then intersect that ray with the mesh. The first face the ray hits is the one under the cursor. From there you read its face index and store it. Anchoring the ray at the camera matters, otherwise a hollow mesh can return its back wall instead of the face you're looking at.",
      },
      {
        q: "Does this work on both Mac and Windows?",
        a: "Yes. The component relies on RhinoCommon's cross-platform `MouseCallback` rather than any OS-specific window hooks, so it behaves the same on macOS and Windows.",
      },
    ],

    references: [
      {
        label: "RhinoCommon MouseCallback documentation",
        url: "https://developer.rhino3d.com/api/rhinocommon/rhino.ui.mousecallback",
      },
      {
        label: "Grasshopper developer docs",
        url: "https://developer.rhino3d.com/guides/grasshopper/",
      },
    ],
  },

];

/* Export for Node (the build script) without breaking the browser,
   where this file is loaded as a plain <script> and ARTICLES becomes
   a global the index page reads. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = ARTICLES;
}
