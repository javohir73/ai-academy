/* =====================================================================
   LEVEL 4 — COMPUTER VISION (concept-first + visual, with GPU-notebook labs).
   Deep learning pointed at images. Per the platform model, the heavy
   PyTorch/GPU lessons use the 'colab' launcher (a free GPU notebook + an
   in-app self-check) rather than in-browser Pyodide. The rest are visual,
   interactive activities (convolve / scenario / sort / match) authored to the
   I-do -> We-do -> You-do shape, same as every other level.

   Composed into the Level 4 track in tracks.js (between L3 and L5).
   ===================================================================== */

export const VISION_LEVELS = [
  {
    "id": "cv-pixels",
    "title": "Images Are Just Grids of Numbers",
    "concept": "Pixels, channels, and the C×H×W shape (plus the RGB-vs-BGR pitfall)",
    "explanation": "A computer never 'sees' a picture — it sees a grid of numbers. A grayscale image is one grid where each cell (a pixel) holds a brightness from 0 (black) to 255 (white). A color image stacks three of these grids: one for Red, one for Green, one for Blue. So a color photo is really three stacked number-grids called channels. Deep-learning libraries describe an image by its shape: C×H×W — Channels (3 for color), Height (rows of pixels), Width (columns). Get the order or the channel meaning wrong and your model 'sees' garbage.",
    "example": {
      "text": "A tiny 2×2 color image has shape 3×2×2: three 2×2 grids. The top-left pixel might be R=255, G=0, B=0 — pure red. Change which grid is 'first' and red can suddenly read as blue. That is the famous RGB-vs-BGR pitfall: OpenCV loads images as BGR, but PyTorch and most models expect RGB. Same numbers, swapped meaning."
    },
    "workedExample": {
      "intro": "Let me read one pixel correctly, step by step, then show how easily the channel order trips people up.",
      "steps": [
        "Brightness scale: every value runs 0–255. 0 is fully off (dark), 255 is fully on (bright). A grayscale pixel of 200 is light gray; 30 is nearly black.",
        "A color pixel is THREE numbers — (R, G, B). (255, 0, 0) is pure red: red maxed, green and blue off. (0, 255, 0) is green. (255, 255, 0) is red+green = yellow.",
        "Shape C×H×W: a 64×64 color image is 3×64×64 — 3 channels, 64 rows, 64 columns. Lose the channel axis (read it as H×W only) and you have thrown away color.",
        "The pitfall: OpenCV gives you (B, G, R) order. Feed that straight into an RGB model and the pixel (255, 0, 0) — which you meant as red — is interpreted as blue. The model's accuracy quietly collapses with no error message."
      ],
      "takeaway": "An image is a C×H×W stack of 0–255 number grids. The numbers are meaningless until you know the channel order — always confirm RGB vs BGR before feeding a model."
    },
    "guided": {
      "prompt": "A color pixel is stored as the three numbers (255, 0, 0). Your library loads images in RGB order. What color is this pixel?",
      "hints": [
        "In RGB order the three numbers mean (Red, Green, Blue), each 0–255.",
        "Here Red is maxed at 255 while Green and Blue are both 0 — only the red channel is on."
      ],
      "answer": "Pure red.",
      "explanation": "In RGB order (255, 0, 0) means red fully on, green and blue off — pure red. If a BGR-loading library handed you these same numbers, the model would instead read them as pure blue: identical numbers, opposite color. That is why channel order matters before anything else."
    },
    "goDeeper": {
      "title": "Why 0–255, and what 'normalizing' does",
      "body": "Each channel value fits in one byte (8 bits = 256 possible values, 0–255), which is why brightness tops out at 255. Before training, we usually 'normalize' these to floats — e.g. divide by 255 to get 0.0–1.0, or subtract a dataset mean and divide by a standard deviation. Models train faster and more stably when inputs are small, centered numbers rather than raw 0–255 integers. The pixel grid is the same picture — just rescaled into a range the network prefers."
    },
    "video": {
      "title": "Pixels, channels, and image shape",
      "description": "How a photo becomes a C×H×W stack of number grids, and why RGB vs BGR can silently break a model.",
      "duration": "3:30"
    },
    "activity": {
      "type": "pixel-grid",
      "prompt": "Here is a tiny color image as a grid of (R, G, B) numbers. Toggle the Red / Green / Blue channels to watch each one's contribution, and click any pixel to read its exact values. Then answer the channel-order question — this is exactly where RGB-vs-BGR bugs hide.",
      "data": {
        "channels": ["r", "g", "b"],
        "pixels": [
          [
            [255, 0, 0],
            [255, 255, 0],
            [0, 255, 0]
          ],
          [
            [255, 128, 0],
            [200, 200, 200],
            [0, 255, 255]
          ],
          [
            [0, 0, 255],
            [128, 0, 255],
            [0, 0, 0]
          ]
        ],
        "check": {
          "question": "The top-left pixel is stored as the three numbers (255, 0, 0) and your library loads images in RGB order. What color is it — and what would a BGR-loading library make of the SAME numbers?",
          "choices": [
            {
              "id": "red-blue",
              "label": "Pure RED in RGB — but a BGR library would read the same numbers as pure BLUE.",
              "correct": true,
              "why": "In RGB order (255, 0, 0) means red maxed, green and blue off → pure red. Feed those identical numbers to a BGR-expecting model and the first channel is treated as blue, so it 'sees' pure blue. Same numbers, opposite color — the classic channel-order bug."
            },
            {
              "id": "always-red",
              "label": "Pure red either way — channel order doesn't change the color.",
              "correct": false,
              "why": "Channel order absolutely changes the meaning. The numbers are just slots; RGB vs BGR decides which slot is red and which is blue, so the SAME (255, 0, 0) flips between red and blue."
            },
            {
              "id": "white",
              "label": "White — all three numbers together make white.",
              "correct": false,
              "why": "White needs all three channels maxed (255, 255, 255). Here only the first is 255 and the other two are 0, so it's a single pure channel, not white."
            },
            {
              "id": "yellow",
              "label": "Yellow — red and green combine to yellow.",
              "correct": false,
              "why": "Yellow is red + green (255, 255, 0). Here green is 0, so there is no green to combine — it's pure red in RGB order."
            }
          ]
        }
      },
      "feedback": {
        "correct": "Exactly — the numbers are meaningless until you know the channel order. (255, 0, 0) is red in RGB and blue in BGR. Always confirm RGB vs BGR before feeding a model, or its accuracy quietly collapses.",
        "incorrect": "An image is just (R, G, B) numbers, but the ORDER decides which number is which color. (255, 0, 0) is pure red in RGB order and pure blue in BGR — same numbers, opposite meaning. Toggle the Red channel off to confirm which slot drives that pixel."
      }
    }
  },
  {
    "id": "cv-conv-by-hand",
    "title": "Convolution by Hand: Sliding a Filter",
    "concept": "Kernels and the sliding dot product (edge / blur / sharpen)",
    "explanation": "A convolution slides a small grid of weights — the kernel (or filter) — across the image. At each position it lays the kernel over a patch of pixels, multiplies each pixel by the kernel weight sitting on top of it, and adds up all the products into ONE output number. Move the window one step over and repeat. The whole output grid is called a feature map. Different kernels detect different things: an edge-detector lights up where brightness changes sharply; a blur kernel averages neighbors; a sharpen kernel exaggerates differences. Convolution is just a sliding, weighted sum — nothing more mysterious than that.",
    "example": {
      "text": "A vertical Sobel edge kernel is [[-1,0,1],[-2,0,2],[-1,0,1]]. Lay it on a flat patch where every pixel is the same value — the negatives and positives cancel and the output is 0 (no edge). Lay it where the left side is dark and the right side is bright, and the positives win, producing a big number: 'edge here!'"
    },
    "workedExample": {
      "intro": "Let me convolve one window by hand with a simple 3×3 BLUR kernel (each weight = 1, so the output is just the SUM of the 9 pixels — a smoothing/averaging move). Watch the sliding dot product step by step.",
      "steps": [
        "Place the kernel over the top-left 3×3 patch. The patch pixels are 10, 10, 10 / 10, 50, 10 / 10, 10, 10.",
        "Multiply each pixel by the kernel weight above it. Every weight is 1, so the nine products are just the nine pixels: 10,10,10,10,50,10,10,10,10.",
        "Add all nine products: 10+10+10 + 10+50+10 + 10+10+10 = 130. That single number is the output for this position.",
        "Slide the window one column right and repeat. Doing this everywhere builds the full output grid — the feature map. (This all-ones kernel smooths the bright center into its dark neighbors, which is what a blur does.)"
      ],
      "takeaway": "Convolution = lay the kernel on a patch, multiply matching cells, sum to one number, then slide. The kernel's weights decide what feature gets detected."
    },
    "guided": {
      "prompt": "You convolve a 3×3 patch [[0,0,0],[0,0,0],[0,0,0]] (all zeros) with ANY kernel. Without computing all nine products, what is the output number?",
      "hints": [
        "The output is the sum of (each pixel × the kernel weight on it).",
        "Every pixel here is 0. Zero times any weight is zero, and a sum of zeros is…"
      ],
      "answer": "0.",
      "explanation": "Each product is pixel × weight = 0 × weight = 0, and summing nine zeros gives 0. This is why a perfectly flat (constant) region produces no response from an edge kernel — there is no change for the filter to react to."
    },
    "goDeeper": {
      "title": "Why edge kernels have negatives, and what 'feature map' means",
      "body": "Edge detectors like Sobel pair negative weights on one side with positive weights on the other. On a flat patch the two sides cancel to ~0; across a brightness jump they don't cancel, so the output spikes — that spike IS the detected edge. The full grid of outputs is the feature map: a new image that is bright wherever the kernel's pattern was found. Stacking many such kernels, each learning its own pattern, is exactly what a convolutional layer does — which is the very next lesson."
    },
    "video": {
      "title": "Convolution, one window at a time",
      "description": "Sliding a kernel, the multiply-and-sum dot product, and how edge / blur / sharpen filters differ.",
      "duration": "4:15"
    },
    "activity": {
      "type": "convolve",
      "prompt": "Apply this 3×3 vertical Sobel edge kernel to the highlighted patch. Multiply each pixel by the kernel weight on top of it, then add all nine products. The patch has a dark LEFT side and a bright RIGHT side — a vertical edge.",
      "data": {
        "mode": "kernel",
        "kernelName": "Sobel (vertical edge)",
        "kernel": [
          [
            -1,
            0,
            1
          ],
          [
            -2,
            0,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ],
        "input": [
          [
            10,
            10,
            90,
            90,
            90
          ],
          [
            10,
            10,
            90,
            90,
            90
          ],
          [
            10,
            10,
            90,
            90,
            90
          ],
          [
            20,
            20,
            80,
            80,
            80
          ],
          [
            20,
            20,
            80,
            80,
            80
          ]
        ],
        "targetCell": {
          "r": 0,
          "c": 0
        },
        "choices": [
          {
            "id": "c0",
            "label": 0,
            "correct": false,
            "why": "0 would mean no edge — but the patch jumps from dark (10s) on the left to bright (90) on the right, so the filter must respond."
          },
          {
            "id": "c320",
            "label": 320,
            "correct": true,
            "why": "Center column weights are 0, so it drops out. Left column (weights -1,-2,-1) over pixels 10,10,10 = -10-20-10 = -40. Right column (weights 1,2,1) over pixels 90,90,90 = 90+180+90 = 360. Total: -40 + 0 + 360 = 320. A big positive number means: strong vertical edge, dark-to-bright left-to-right."
          },
          {
            "id": "c40",
            "label": 40,
            "correct": false,
            "why": "40 is too small — you may have only counted one row. Sum across all three rows of the left and right columns; the middle column contributes 0."
          },
          {
            "id": "cneg320",
            "label": -320,
            "correct": false,
            "why": "The sign tells you edge direction. Bright on the RIGHT (positive weights) minus dark on the left gives a large POSITIVE result, +320, not -320."
          }
        ]
      },
      "feedback": {
        "correct": "Nailed it — +320. The middle column's zero weights drop out; the dark left (-40) and bright right (+360) sum to a big positive number that screams 'vertical edge here.' That is convolution working as an edge detector.",
        "incorrect": "Work it column by column: middle column weights are 0 (ignore it). Left column weights are -1,-2,-1 over the dark pixels; right column weights are 1,2,1 over the bright pixels. Add the two results — it should come out strongly positive."
      }
    }
  },
  {
    "id": "cv-why-fc-fails",
    "title": "Why Plain Networks Choke on Images",
    "concept": "Parameter explosion, no spatial structure, no translation invariance",
    "explanation": "Before CNNs, the obvious idea was to flatten an image into one long list of pixels and feed it to a fully-connected (FC) network where every neuron connects to every pixel. This fails for three reasons. (1) Parameter explosion: a single neuron looking at a 200×200 color image needs 200×200×3 = 120,000 weights — and a layer has many neurons. The model becomes enormous and overfits. (2) No spatial structure: flattening destroys which pixels were neighbors, so the network can't tell that nearby pixels form an edge or a shape. (3) No translation invariance: train it on a cat in the top-left and it has no idea the same cat in the bottom-right is still a cat — it must relearn every position from scratch. Convolutions fix all three by sliding a small, SHARED filter across the image.",
    "example": {
      "text": "One FC neuron on a 200×200×3 image = 120,000 weights. A 3×3 convolution filter on the same color image = 3×3×3 = just 27 weights, and it reuses those same 27 weights at every position. That reuse — parameter sharing — is why a conv filter that learns 'edge' at the top-left automatically detects that edge anywhere in the image."
    },
    "workedExample": {
      "intro": "Let me make the parameter explosion concrete, then show how parameter sharing dissolves it.",
      "steps": [
        "Count FC weights for one neuron on a 200×200 color image: 200 × 200 × 3 = 120,000 weights — for a SINGLE neuron. A real layer stacks hundreds or thousands of them.",
        "Now count a 3×3 conv filter on the same color image: 3 × 3 × 3 channels = 27 weights total. That is over 4,000× fewer numbers to learn.",
        "Parameter sharing: that one 27-weight filter slides across the WHOLE image, using the same weights everywhere. So a feature learned in one corner is detected in every corner — this is translation invariance, for free.",
        "Spatial structure: because the filter looks at a small neighborhood (a 3×3 patch), it knows which pixels are adjacent. Flattening into a 1-D list throws that neighbor information away — the FC net never recovers it."
      ],
      "takeaway": "FC nets on images explode in size, ignore which pixels are neighbors, and must relearn each object position. A small shared conv filter is tiny, respects neighborhoods, and recognizes a feature anywhere it appears."
    },
    "guided": {
      "prompt": "A single fully-connected neuron looks at a 200×200 RGB (3-channel) image. How many weights does it need — and is that a problem?",
      "hints": [
        "An FC neuron has one weight per input value. Count the input values: width × height × channels.",
        "200 × 200 × 3. Then ask: is that a lot for just ONE of many neurons in a layer?"
      ],
      "answer": "120,000 weights — and yes, that is a huge problem.",
      "explanation": "200 × 200 × 3 = 120,000 weights for ONE neuron; a full layer multiplies that by its neuron count, ballooning into millions of parameters that overfit and train slowly. A 3×3 conv filter needs only 27 weights and shares them across the image — which is exactly why CNNs replaced FC nets for vision."
    },
    "goDeeper": {
      "title": "Parameter sharing IS the assumption that vision is local and repeatable",
      "body": "A conv filter encodes two beliefs about images: features are LOCAL (an edge lives in a small patch, so you only need a small filter) and features are REPEATABLE (the same edge can appear anywhere, so reuse the same weights everywhere). Those two assumptions — locality and weight sharing — are what slash the parameter count and grant translation invariance. An FC net assumes neither, so it wastes capacity learning position-specific, neighbor-blind patterns. When your data really does have local, repeatable structure (images, audio spectrograms), convolutions are a near-perfect fit."
    },
    "video": {
      "title": "Why fully-connected nets fail on images",
      "description": "Parameter explosion, lost spatial structure, and no translation invariance — and how a shared conv filter fixes all three.",
      "duration": "4:00"
    },
    "activity": {
      "type": "calc",
      "prompt": "Feel the parameter explosion for yourself. A single fully-connected neuron on a 200×200 RGB image needs one weight per input value. A 3×3 conv filter on the same image reuses just F×F×C weights everywhere. How many times MORE weights does the FC neuron use than the conv filter?",
      "data": {
        "mode": "param-explosion",
        "H": 200,
        "W": 200,
        "C": 3,
        "kernel": 3,
        "ask": "ratio",
        "prompt": "How many times MORE weights does ONE fully-connected neuron (H×W×C) use than ONE 3×3 conv filter (F×F×C) on this 200×200 RGB image?"
      },
      "feedback": {
        "correct": "Right — 120,000 FC weights vs 27 conv weights is about 4,444× more, and that's for a SINGLE neuron. A whole FC layer multiplies the blowup, which is exactly why a small, shared conv filter replaced fully-connected nets for images.",
        "incorrect": "Count both: an FC neuron needs H×W×C = 200×200×3 = 120,000 weights; a 3×3 conv filter needs F×F×C = 3×3×3 = 27. The ratio is 120,000 / 27 ≈ 4,444 — that gap is the parameter explosion convolutions avoid."
      }
    }
  },
  {
    "id": "cv-conv-layer",
    "title": "The Convolution Layer",
    "concept": "Learnable kernels slide across the image to make feature maps",
    "explanation": "A convolution layer is just the sliding dot-product you did by hand — but now the kernel numbers are LEARNED, not chosen. Each filter slides across the whole image, and at every position it multiplies-and-sums the patch under it. The grid of results it leaves behind is a feature map: a heatmap of where that filter's pattern showed up. One layer holds many filters (say 16), so it outputs 16 feature maps stacked into a depth-16 volume. Two ideas make this powerful: parameter sharing (the SAME small filter is reused everywhere, so a 3x3 filter is just 9 weights no matter how big the image) and translation invariance (a filter that finds an edge finds it in any corner).",
    "example": {
      "text": "Picture one 3x3 'vertical-edge' filter sweeping a 32x32 photo. Wherever a vertical edge sits, that spot in the feature map lights up bright; flat areas stay near zero. Add a second filter for horizontal edges and you get a second feature map. Sixteen filters -> sixteen feature maps -> a 28x28x16 output volume that the next layer reads."
    },
    "workedExample": {
      "intro": "The one pitfall beginners hit is the OUTPUT SIZE. The width/height of a feature map is fixed by four numbers: input size W, filter size F, padding P, stride S. Watch me apply the formula output = (W - F + 2P) / S + 1.",
      "steps": [
        "W=32, F=5, P=0, S=1: (32 - 5 + 0)/1 + 1 = 27 + 1 = 28. A 32x32 input through a 5x5 filter (no padding) gives a 28x28 feature map.",
        "Want to KEEP 32x32? Add padding P=2: (32 - 5 + 4)/1 + 1 = 31 + 1 = 32. 'Same' padding pads the border so the size is preserved.",
        "Watch the trap: W=10, F=3, P=0, S=2 gives (10 - 3 + 0)/2 + 1 = 7/2 + 1 = 4.5 — not a whole number. A feature map cannot have half a cell, so that stride/padding combo is INVALID. You must change S or P."
      ],
      "takeaway": "output = (W - F + 2P)/S + 1. If it is not a whole number, the layer is misconfigured — fix the stride or padding before training."
    },
    "guided": {
      "prompt": "A layer has 16 filters, each 3x3, reading an RGB (3-channel) image. How many feature maps does it OUTPUT, and roughly how many weights does the layer learn?\n\nThink: one output map per filter; each 3x3 filter spans all 3 input channels.",
      "hints": [
        "Output depth = number of filters. One filter -> one feature map.",
        "Each filter is 3x3 across all 3 input channels = 3*3*3 = 27 weights, plus 1 bias = 28. Sixteen of them is about 16*28.",
        "Compare that to a fully-connected layer on the raw image — thousands of weights per neuron. Parameter sharing is why conv layers stay tiny."
      ],
      "answer": "16 feature maps out; about 16 x (3*3*3 + 1) = 448 weights total.",
      "explanation": "Output depth equals the filter count (16), so you get 16 feature maps. Each 3x3 filter must cover all 3 input channels (27 weights) plus a bias, and that same small filter is reused at every position — parameter sharing keeps the whole layer to a few hundred weights, not the hundreds of thousands a fully-connected layer would need."
    },
    "goDeeper": {
      "title": "Why depth grows as size shrinks",
      "body": "A typical CNN trades spatial size for semantic depth: early layers keep large feature maps with few channels (lots of 'where', little 'what'), and as you go deeper the maps get smaller but the channel count climbs (less 'where', much more 'what'). By the final conv block you might have a 4x4x256 volume: spatially tiny, but each of the 256 channels answers a rich question like 'is there fur here?' or 'is this a wheel?'. Flatten that and a small classifier head finishes the job."
    },
    "video": {
      "title": "Inside a convolution layer",
      "description": "How learnable filters slide to make feature maps, and how to size the output with (W-F+2P)/S+1.",
      "duration": "4:30"
    },
    "activity": {
      "type": "calc",
      "prompt": "Configure the first conv layer and size its output yourself with output = (W − F + 2P)/S + 1. A 32×32 image goes through a 5×5 filter with no padding and stride 1. What is the output feature-map side length?",
      "data": {
        "mode": "conv-output",
        "W": 32,
        "F": 5,
        "P": 0,
        "S": 1,
        "prompt": "Input W = 32, filter F = 5, padding P = 0, stride S = 1. What is the output side length? (If the formula doesn't land on a whole number, tick 'invalid' instead.)"
      },
      "feedback": {
        "correct": "Exactly — (32 − 5 + 0)/1 + 1 = 27 + 1 = 28, so a 32×32 input through a 5×5 filter (no padding) gives a 28×28 feature map. Always size the output with the formula before training; if it isn't a whole number, the stride/padding is invalid.",
        "incorrect": "Plug in: (W − F + 2P)/S + 1 = (32 − 5 + 0)/1 + 1 = 28. The map shrinks from 32 to 28 because there's no padding to make up for the 5×5 window's reach. (Add P=2 and you'd keep 32 — 'same' padding.)"
      }
    }
  },
  {
    "id": "cv-pooling",
    "title": "Pooling & Stride",
    "concept": "Shrink feature maps on purpose — keep the signal, drop the resolution",
    "explanation": "After a conv layer lights up its feature maps, we usually shrink them. Two tools do this. POOLING slides a small window (often 2x2) and replaces each window with one number: max pooling keeps the strongest response (the loudest 'I found my pattern here'), average pooling keeps the mean. STRIDE is how far the window jumps each step — stride 2 means it hops two cells, so it visits half as many positions and the output is roughly half the size. Both shrink the map. That is the point: a smaller map is cheaper to compute and gives a little translation tolerance (a feature can wiggle a pixel and still survive the pooling). The cost is real, though — you permanently throw away fine spatial detail, so you cannot recover exactly WHERE inside the window the signal was.",
    "example": {
      "text": "Take a 2x2 max-pool over the patch [[9, 1], [6, 8]]. Max pooling keeps the single biggest value, 9, and discards 1, 6, 8. Average pooling would instead return (9+1+6+8)/4 = 6. Either way, four cells became one — the map just shrank by 2x in each direction."
    },
    "workedExample": {
      "intro": "Let me run a 2x2 max-pool with stride 2 across a 4x4 feature map, so the windows do not overlap and the output is exactly 2x2. The map is [[1, 3, 9, 1], [2, 4, 6, 8], [5, 0, 7, 2], [1, 6, 3, 4]].",
      "steps": [
        "Top-left window [[1,3],[2,4]] -> max is 4.",
        "Top-right window [[9,1],[6,8]] -> max is 9.",
        "Bottom-left [[5,0],[1,6]] -> max is 6; bottom-right [[7,2],[3,4]] -> max is 7. The 4x4 map becomes a 2x2 map [[4,9],[6,7]] — same strongest signals, a quarter of the cells."
      ],
      "takeaway": "Max-pool keeps the loudest response in each window; stride sets how much the map shrinks. Pooling trades exact location for a smaller, cheaper, slightly more robust map."
    },
    "guided": {
      "prompt": "A 28x28 feature map goes through 2x2 max pooling with stride 2. What is the output size, and what information did you just give up?",
      "hints": [
        "A non-overlapping 2x2 pool with stride 2 halves each dimension.",
        "28 / 2 = 14, so the map becomes 14x14.",
        "You kept the maximum in each 2x2 block but lost WHICH of the four cells it came from — that is the resolution you trade away."
      ],
      "answer": "14x14. You keep the strongest value per 2x2 block but lose its exact position inside the block.",
      "explanation": "Stride-2 2x2 pooling halves width and height (28->14), cutting the cell count to a quarter. You preserve the strongest activation in each window, which gives a little translation tolerance, but you can no longer tell exactly where in the 2x2 region it occurred — that fine spatial detail is gone for good."
    },
    "goDeeper": {
      "title": "Strided conv vs pooling",
      "body": "Pooling is not the only way to downsample. Many modern networks drop pooling and instead use a convolution with stride 2 — the conv both extracts features AND shrinks the map in one learnable step. Pooling has no parameters and is a fixed rule (max or average); strided conv learns how to summarize. Both reduce resolution; the question is whether you want a hand-picked rule (pooling) or a learned one (strided conv). Either way, plan your downsampling so the final feature map is small enough for the classifier head but not so small that you have crushed away the signal."
    },
    "video": {
      "title": "Pooling and stride, visually",
      "description": "Watch a 2x2 window shrink a feature map, and see exactly what detail pooling throws away.",
      "duration": "3:45"
    },
    "activity": {
      "type": "convolve",
      "prompt": "Slide the 2x2 max-pool window to the highlighted region and read off the value that lands in the output cell.",
      "data": {
        "mode": "pool",
        "op": "max",
        "input": [
          [
            1,
            3,
            9,
            1
          ],
          [
            2,
            4,
            6,
            8
          ],
          [
            5,
            0,
            7,
            2
          ],
          [
            1,
            6,
            3,
            4
          ]
        ],
        "targetCell": {
          "r": 0,
          "c": 2
        },
        "choices": [
          {
            "id": "max-9",
            "label": 9,
            "correct": true,
            "why": "The 2x2 window covers 9, 1, 6, 8. Max pooling keeps the single largest value, which is 9 — the strongest response in that region survives, the rest are dropped."
          },
          {
            "id": "avg-6",
            "label": 6,
            "correct": false,
            "why": "6 is the AVERAGE of 9, 1, 6, 8 ((9+1+6+8)/4 = 6). That is what average pooling would return — but this window is MAX pooling, so the answer is the biggest value, 9."
          },
          {
            "id": "sum-24",
            "label": 24,
            "correct": false,
            "why": "24 is the SUM of the four cells (9+1+6+8). Pooling never sums — max pooling keeps the largest single value (9), not the total."
          },
          {
            "id": "min-1",
            "label": 1,
            "correct": false,
            "why": "1 is the smallest value in the window. Max pooling keeps the largest, not the smallest — that would throw away the strong signal we want to keep."
          }
        ]
      },
      "feedback": {
        "correct": "Right — max pooling keeps the loudest response (9) and discards the rest. Do this across the whole map and it shrinks while keeping its strongest signals.",
        "incorrect": "Look only at the four highlighted cells. Max pooling reports the LARGEST of them — not their sum, average, or minimum."
      }
    }
  },
  {
    "id": "cv-build-cnn",
    "title": "Build a CNN in PyTorch (CIFAR-10)",
    "kind": "lab",
    "concept": "Train a small convolutional network on real images, on a free GPU",
    "explanation": "Time to assemble the pieces into a working network. CIFAR-10 is 60,000 tiny 32x32 color photos in 10 classes (plane, car, bird, cat, ...). Training even a small CNN on images is heavy, so we do NOT run it in your browser — we use a free cloud GPU (Google Colab or Kaggle). You will stack two or three conv blocks (Conv2d -> ReLU -> MaxPool), flatten the final feature volume, and finish with a couple of fully-connected layers into 10 outputs. Then you train for a few epochs and watch test accuracy climb well past random chance (10%).",
    "example": {
      "text": "A minimal block in PyTorch: nn.Conv2d(3, 16, kernel_size=3, padding=1) then nn.ReLU() then nn.MaxPool2d(2). The conv turns 3 channels into 16 feature maps (size kept at 32x32 by padding=1), ReLU zeroes the negatives, and the 2x2 pool halves it to 16x16. Repeat to go deeper, then flatten and classify."
    },
    "workedExample": {
      "intro": "Before you open the notebook, here is the shape every CNN forward pass follows. Trace the volume as it flows: channels grow, spatial size shrinks.",
      "steps": [
        "Input is 3x32x32 (RGB). Block 1: Conv2d(3->16, pad 1) keeps 32x32, ReLU, MaxPool2d(2) -> 16x16x16.",
        "Block 2: Conv2d(16->32, pad 1) keeps 16x16, ReLU, MaxPool2d(2) -> 8x8x32. Notice depth doubled while H and W halved.",
        "Flatten 8*8*32 = 2048 numbers into a vector, pass through Linear(2048 -> 64) -> ReLU -> Linear(64 -> 10). Those 10 logits feed CrossEntropyLoss; the optimizer (e.g. Adam) updates every weight each step."
      ],
      "takeaway": "A CNN is conv blocks (Conv -> ReLU -> Pool) that grow depth and shrink size, then a flatten and a small classifier head into one logit per class."
    },
    "guided": {
      "prompt": "In your forward() method, what must happen to the feature volume right BEFORE the first nn.Linear layer, and why?",
      "hints": [
        "Conv and pool layers work on a 4D volume (batch, channels, height, width). A Linear layer expects a flat 2D shape (batch, features).",
        "You need to collapse channels x height x width into one long vector per image.",
        "In PyTorch that is x = torch.flatten(x, 1) (or x.view(x.size(0), -1)) before the first Linear."
      ],
      "answer": "Flatten the volume to (batch, features) — e.g. torch.flatten(x, 1) — before the first Linear layer.",
      "explanation": "Conv/pool layers output a 4D volume (batch, channels, H, W), but a fully-connected nn.Linear expects a 2D (batch, features) input. You must flatten the per-image volume into a single vector first; forgetting this is the most common shape-mismatch error when building a CNN."
    },
    "goDeeper": {
      "title": "Why a GPU, and what 'an epoch' buys you",
      "body": "A CNN does millions of multiply-adds per image, and CIFAR-10 has tens of thousands of images per epoch — a CPU would crawl, but a GPU runs those operations massively in parallel and finishes an epoch in seconds. One epoch = one full pass over the training set. Watch the pattern: test accuracy jumps fast in the first few epochs, then climbs more slowly. If training accuracy keeps rising while test accuracy stalls or falls, you are starting to overfit — exactly the train-vs-test gap you measured earlier, now on images."
    },
    "video": {
      "title": "Your first CNN on CIFAR-10",
      "description": "Stack conv blocks, flatten, classify, and train on a free GPU — start to finish.",
      "duration": "6:30"
    },
    "activity": {
      "type": "builder",
      "prompt": "Before you open the GPU notebook, assemble the network on paper. Tap the layers IN ORDER to build a 2-block CNN for CIFAR-10: two Conv → ReLU → Pool blocks, then flatten and a classifier head. Tap a placed layer to remove it and everything after it.",
      "data": {
        "targetPrompt": "Build: Conv → ReLU → Pool, Conv → ReLU → Pool, then Flatten → Linear → ReLU → Linear(→ 10 classes). Tap layers in order; tap a placed layer to remove from there.",
        "tiles": [
          { "id": "conv1", "label": "Conv2d(3→16)", "note": "block 1 filters" },
          { "id": "relu1", "label": "ReLU", "note": "non-linearity" },
          { "id": "pool1", "label": "MaxPool2d(2)", "note": "downsample" },
          { "id": "conv2", "label": "Conv2d(16→32)", "note": "block 2 filters" },
          { "id": "relu2", "label": "ReLU", "note": "non-linearity" },
          { "id": "pool2", "label": "MaxPool2d(2)", "note": "downsample" },
          { "id": "flatten", "label": "Flatten", "note": "volume → vector" },
          { "id": "fc1", "label": "Linear → 64", "note": "hidden head" },
          { "id": "relu3", "label": "ReLU", "note": "non-linearity" },
          { "id": "fc2", "label": "Linear → 10", "note": "class scores" }
        ],
        "correct": ["conv1", "relu1", "pool1", "conv2", "relu2", "pool2", "flatten", "fc1", "relu3", "fc2"],
        "mismatch": {
          "flatten": "Flatten comes AFTER the last conv block, not before — flattening early destroys the 2-D layout the next Conv2d needs.",
          "fc1": "A Linear (fully-connected) head can't read a 4-D conv volume. You must place a Flatten before any Linear layer.",
          "fc2": "The final Linear → 10 is the very last layer (one score per class). Anything after it doesn't belong.",
          "pool1": "Pooling downsamples AFTER the activation — the order inside a block is Conv → ReLU → Pool.",
          "relu1": "ReLU (the non-linearity) goes right after the Conv that produced the feature maps."
        }
      },
      "feedback": {
        "correct": "That's the canonical CNN: two Conv → ReLU → Pool blocks (depth grows 3→16→32 while H and W halve each block), then Flatten and a small Linear head ending in 10 class scores. Now open the notebook on a free GPU (Colab: Runtime → Change runtime type → GPU; Kaggle: Settings → Accelerator → GPU), build exactly this model, train it 3–5 epochs on CIFAR-10, and confirm test accuracy climbs well past 10%.",
        "incorrect": "Walk one block at a time: Conv → ReLU → Pool, then repeat, THEN Flatten once and finish with Linear → ReLU → Linear(→10). The two classic traps are putting a Linear layer before Flatten (a 4-D volume can't enter nn.Linear) and pooling before the activation."
      }
    }
  },
  {
    "id": "cv-feature-maps",
    "title": "Visualizing What Filters Learn",
    "concept": "Early layers see edges and colors; deep layers see parts and objects",
    "explanation": "A trained CNN is not a black box once you LOOK at its feature maps. If you visualize what each filter responds to, a clear story appears. The first layers learn dead-simple detectors: edges at various angles, blobs of color, simple gradients — the visual alphabet. Middle layers combine those into textures and small motifs: stripes, grids, corners. Deep layers combine THOSE into parts and whole objects: an eye, a wheel, a dog's face. Each layer builds on the patterns of the one below it, which is why a CNN goes from 'pixels' to 'meaning' in just a handful of blocks. This also explains transfer learning's superpower (next module): those early edge/color detectors are useful for almost any image task, so you can reuse them.",
    "example": {
      "text": "Feed a photo of a car through a trained CNN and inspect feature maps at three depths. Layer 1: one map lights up along every vertical edge, another along bright-red regions. Layer 3: a map fires on repeating grille texture. Layer 6: a single channel fires strongly only where a wheel is — it has learned 'wheel-ness'."
    },
    "workedExample": {
      "intro": "Here is how to read a stack of feature maps by depth. The deeper you go, the more abstract and the more class-specific the responses become.",
      "steps": [
        "Early (layer 1-2): maps respond to edges, corners, and color blobs — generic, present in ANY image, not tied to one class.",
        "Middle (layer 3-4): maps respond to textures and small parts — fur, stripes, grids — combinations of the early edges.",
        "Deep (last blocks): maps respond to whole parts or objects — a face, a wheel, a beak — and these are highly specific to the classes the network was trained on."
      ],
      "takeaway": "Depth = abstraction. Early filters are generic edge/color detectors (reusable everywhere); deep filters are specific object-part detectors (tuned to the task)."
    },
    "guided": {
      "prompt": "You visualize a feature map from the FINAL conv block and it lights up only on dogs' faces. Would you expect a FIRST-layer feature map to be that specific? Why or why not?",
      "hints": [
        "Think about what each layer is built from. The first layer only sees raw pixels.",
        "Specific concepts like 'dog face' are combinations of many simpler patterns stacked across layers.",
        "Early filters fire on generic things (edges, colors) that appear in cats, cars, and dogs alike."
      ],
      "answer": "No — a first-layer map fires on generic edges/colors, not on a specific concept like 'dog face'.",
      "explanation": "Early filters only have raw pixels to work with, so they can only detect simple, generic patterns (edges, colors) that appear across every class. A concept as specific as a dog's face requires stacking many of those simple detectors over several layers — which is exactly why only the DEEP layers show class-specific responses."
    },
    "goDeeper": {
      "title": "Why this makes transfer learning work",
      "body": "Because the early layers learn the same generic visual alphabet for almost any natural-image task, a network trained on millions of ImageNet photos has already learned excellent edge, color, and texture detectors. When you face a new, smaller image problem, you can keep (freeze) those early layers and only retrain the deep, task-specific end. You get the benefit of all that pretraining without the data or compute to learn edges from scratch. That is the bridge into the next module: classic architectures and transfer learning."
    },
    "video": {
      "title": "Seeing through a CNN's eyes",
      "description": "Feature-map visualizations from shallow to deep, and the build-up from edges to objects.",
      "duration": "4:15"
    },
    "activity": {
      "type": "featuremap",
      "prompt": "Explore what filters learn at different depths. Step through Early → Mid → Deep and watch the activation maps go from generic edges to a class-specific object part. Then answer the question.",
      "data": {
        "mode": "depth",
        "layers": [
          {
            "id": "early",
            "label": "Early (layer 1–2)",
            "caption": "A vertical-edge detector: it fires in a bright stripe wherever brightness changes left-to-right. Generic — this pattern appears in cats, cars, and dogs alike.",
            "grid": [
              [0, 2, 9, 2, 0],
              [0, 2, 9, 2, 0],
              [0, 2, 9, 2, 0],
              [0, 2, 9, 2, 0],
              [0, 2, 9, 2, 0]
            ]
          },
          {
            "id": "mid",
            "label": "Mid (layer 3–4)",
            "caption": "A texture/motif detector: built from many edges, it responds to a repeating grid-like pattern. More specific than an edge, still not tied to one class.",
            "grid": [
              [9, 1, 9, 1, 9],
              [1, 6, 1, 6, 1],
              [9, 1, 9, 1, 9],
              [1, 6, 1, 6, 1],
              [9, 1, 9, 1, 9]
            ]
          },
          {
            "id": "deep",
            "label": "Deep (last block)",
            "caption": "An object-part detector: this single channel fires strongly in ONE region — it has learned 'wheel-ness' / 'eye-ness'. Highly class-specific, built from all the simpler detectors below it.",
            "grid": [
              [0, 0, 1, 0, 0],
              [0, 6, 9, 6, 0],
              [1, 9, 9, 9, 1],
              [0, 6, 9, 6, 0],
              [0, 0, 1, 0, 0]
            ]
          }
        ],
        "check": {
          "question": "You visualize a feature map from the FINAL conv block and it lights up only on dogs' faces. Would you expect a FIRST-layer feature map to be that specific?",
          "choices": [
            {
              "id": "no",
              "label": "No — a first-layer map fires on generic edges and colors, not a specific concept like 'dog face'.",
              "correct": true,
              "why": "Early filters only have raw pixels to work with, so they detect simple, generic patterns (edges, colors) shared across every class. A concept as specific as a dog's face is built by stacking many simple detectors over several layers — which is exactly why only DEEP layers show class-specific responses. (It's also why those generic early layers transfer to almost any image task.)"
            },
            {
              "id": "yes-equal",
              "label": "Yes — every layer is equally specific, so the first layer also detects 'dog face' directly.",
              "correct": false,
              "why": "Specificity GROWS with depth. The first layer sees only raw pixels and can't represent a high-level concept; it fires on generic edges/colors. 'Dog face' emerges only after many layers combine those simpler patterns."
            },
            {
              "id": "yes-color",
              "label": "Yes, because the first layer can detect brown fur color, which is basically the same as detecting a dog.",
              "correct": false,
              "why": "Detecting a brown color blob is a generic, early-layer response — and brown appears in countless non-dog things (mud, wood, bears). A reliable 'dog face' detector needs shape and part structure that only deep layers assemble."
            }
          ]
        }
      },
      "feedback": {
        "correct": "Right — depth equals abstraction. Early filters are generic edge/color detectors (reusable everywhere); deep filters are specific object-part detectors tuned to the task. That build-up is exactly why transfer learning works.",
        "incorrect": "Compare the three depths you explored: Early fires on a generic edge, Deep fires on one object part. The first layer only sees raw pixels, so it can't be 'dog-face specific' — that specificity is assembled layer by layer."
      }
    }
  },
  {
    "id": "cv-architectures",
    "title": "Classic CNN Architectures",
    "concept": "LeNet to ResNet — and why deeper isn't always better",
    "explanation": "Convolutional networks did not appear all at once. Each famous architecture solved one bottleneck that was blocking the previous one. LeNet (1998) proved convolutions could read handwritten digits on tiny images. AlexNet (2012) scaled that up with GPUs, ReLU, and dropout and shocked the world by winning ImageNet. VGG (2014) showed that stacking many small 3x3 filters in a deep, uniform pattern works beautifully. ResNet (2015) then broke the 'deeper is better' assumption: past a point, simply piling on more plain layers made networks HARDER to train and actually scored WORSE, until skip connections fixed it.",
    "example": {
      "text": "A 56-layer plain network scored worse than a 20-layer one on both training AND test data — not overfitting, just untrainable. That surprising result is exactly what motivated the next lesson's skip connections. Bigger is not automatically smarter."
    },
    "workedExample": {
      "intro": "Read the timeline as a chain of fixes. I'll walk each architecture by the one idea it added.",
      "steps": [
        "LeNet-5 (1998): the original conv-net. Small grayscale digits, a couple of conv + pooling layers. Proof of concept that convolution beats hand-coded features.",
        "AlexNet (2012): same idea, much bigger, trained on two GPUs. Added ReLU activations and dropout, and won ImageNet by a huge margin — the spark of the deep-learning boom.",
        "VGG (2014): go deep with a simple, repeating recipe — only 3x3 convolutions stacked many times. Elegant and uniform, but heavy on parameters.",
        "ResNet (2015): noticed that plain very-deep nets get worse, and added skip connections so 50, 101, even 152 layers finally train. This is the deeper-isn't-always-better lesson."
      ],
      "takeaway": "Each architecture added exactly one key idea; ResNet's lesson is that depth only helps once you solve how to train it."
    },
    "guided": {
      "prompt": "A team replaces their 18-layer CNN with a 50-layer PLAIN CNN (no skip connections) and finds BOTH training and test accuracy got worse. Is this overfitting?",
      "hints": [
        "Overfitting means GREAT on training data but poor on test data — a gap. Here even training accuracy dropped.",
        "If the network can't even fit the training data well, the problem is trainability (optimization), not generalization."
      ],
      "answer": "No — it is an optimization/trainability problem, not overfitting.",
      "explanation": "Overfitting shows up as a train-vs-test GAP. When training accuracy itself falls as you add plain layers, gradients are struggling to flow through the depth. That degradation is the exact problem ResNet's skip connections were invented to solve."
    },
    "goDeeper": {
      "title": "Why VGG is 'expensive' and ResNet is 'efficient'",
      "body": "VGG's uniform stacks of 3x3 convs plus huge fully-connected layers push it well over 100 million parameters, most of them in the dense head. ResNet replaces that giant dense head with global average pooling and reuses features through skip connections, so a ResNet-50 is both deeper AND has fewer parameters (~25M) than VGG-16 (~138M) — while scoring better. More layers, fewer weights, higher accuracy: architecture design, not raw size, is what wins."
    },
    "video": {
      "title": "From LeNet to ResNet",
      "description": "A guided tour of the four landmark CNN architectures and the single idea each one contributed.",
      "duration": "4:30"
    },
    "activity": {
      "type": "match",
      "prompt": "Match each landmark architecture to the key idea it introduced.",
      "data": {
        "leftHead": "Architecture",
        "rightHead": "Its key contribution",
        "pairs": [
          {
            "left": "LeNet-5 (1998)",
            "right": "First working conv-net: read handwritten digits on tiny grayscale images"
          },
          {
            "left": "AlexNet (2012)",
            "right": "Scaled up on GPUs with ReLU + dropout, won ImageNet by a wide margin"
          },
          {
            "left": "VGG (2014)",
            "right": "Go deep with a simple repeating recipe of stacked 3x3 convolutions"
          },
          {
            "left": "ResNet (2015)",
            "right": "Skip connections make very deep nets (50+ layers) finally trainable"
          }
        ]
      },
      "feedback": {
        "correct": "Exactly — each architecture added one decisive idea, and ResNet's skip connections set up the next lesson on residual connections.",
        "incorrect": "Re-link by era: LeNet started it, AlexNet scaled it on GPUs, VGG stacked tiny 3x3 filters deep, and ResNet added skip connections to train very deep nets."
      }
    }
  },
  {
    "id": "cv-residual",
    "title": "Residual (Skip) Connections",
    "concept": "Why a tiny shortcut made very deep networks trainable",
    "explanation": "A residual connection adds a layer's INPUT straight onto its output: out = F(x) + x. Instead of forcing each block to learn the full transformation from scratch, it only has to learn the small change (the 'residual') on top of just passing the input through. This identity shortcut gives gradients a clean highway to flow backward through dozens or hundreds of layers, so the network can be made very deep WITHOUT the signal fading away. It also means a block can trivially learn to do nothing (F(x)=0, so out=x), so adding more layers can never make things worse the way plain stacking did.",
    "example": {
      "text": "Picture a relay race where each runner can either run their leg OR simply hand the baton straight to the finish. With that option, adding more runners never slows the team down — at worst they pass the baton through. Skip connections give every layer that 'pass it through' option."
    },
    "workedExample": {
      "intro": "Let me trace why the shortcut helps, both forward and backward.",
      "steps": [
        "Forward: a residual block computes out = F(x) + x, where F is the conv layers. The raw input x is carried forward unchanged alongside the learned part.",
        "Easy identity: if the best thing a block can do is nothing, it just learns F(x) ≈ 0, leaving out ≈ x. Plain layers can't easily learn to be the identity, so they can hurt.",
        "Backward: the gradient flows along the +x shortcut directly to earlier layers, even if the gradient through F has shrunk toward zero. That prevents the vanishing-gradient stall.",
        "Result: ResNet trained 50, 101, and 152 layers and kept improving, where plain nets had degraded past ~20 layers."
      ],
      "takeaway": "out = F(x) + x: the shortcut lets gradients flow and lets deep blocks safely default to doing nothing, so depth stops being a curse."
    },
    "guided": {
      "prompt": "In a residual block, the conv path F(x) learns weights close to zero. What does the block output, and is that a problem?",
      "hints": [
        "The block computes F(x) + x. Substitute F(x) ≈ 0.",
        "Outputting the input unchanged means the layer is harmless — it just passes signal through."
      ],
      "answer": "It outputs ≈ x (the identity), which is fine — the block harmlessly passes the input through.",
      "explanation": "Because out = F(x) + x, an F that's near zero gives out ≈ x. The ability to cheaply become the identity is exactly why stacking more residual blocks can't degrade performance the way plain layers did."
    },
    "goDeeper": {
      "title": "Vanishing gradients, intuitively",
      "body": "Training updates each weight using a gradient passed backward layer by layer, each step multiplying by small numbers. Over many plain layers those products shrink toward zero, so early layers barely update — the 'vanishing gradient.' The +x shortcut adds a path whose gradient is simply 1 (the derivative of x is 1), so some healthy gradient always reaches the early layers regardless of how the conv path behaves. That single addition is most of why deep learning could finally go very deep."
    },
    "video": {
      "title": "The skip connection",
      "description": "How out = F(x) + x rescues gradient flow and lets networks go hundreds of layers deep.",
      "duration": "3:50"
    },
    "activity": {
      "type": "scenario",
      "prompt": "Researchers add skip connections and a plain 100-layer net that wouldn't train now trains well. What is the BEST explanation of why skip connections helped?",
      "data": {
        "scenario": "Before: a 100-layer PLAIN CNN had worse training accuracy than a shallow one — gradients seemed to vanish in the early layers. After: the same depth with residual connections (out = F(x) + x) trains smoothly and scores higher. Pick the best reason the shortcut fixed this.",
        "multi": false,
        "choices": [
          {
            "id": "gradient-highway",
            "label": "The +x shortcut gives gradients a direct path back to early layers and lets blocks default to the identity, so depth no longer stalls training.",
            "correct": true,
            "why": "Right. The shortcut's gradient is 1, so signal reaches early layers even when the conv path's gradient shrinks; and F(x)=0 makes a block harmless. That is exactly why very deep nets became trainable."
          },
          {
            "id": "more-params",
            "label": "Skip connections add a lot of new learnable parameters, giving the model more capacity.",
            "correct": false,
            "why": "No — a plain addition of x adds essentially no parameters. The benefit is gradient flow and easy identity mappings, not extra capacity."
          },
          {
            "id": "regularize",
            "label": "They act like dropout and reduce overfitting, which is why training improved.",
            "correct": false,
            "why": "The original problem was poor TRAINING accuracy (underfitting/trainability), not overfitting. Skip connections fix optimization, not a train-vs-test gap."
          },
          {
            "id": "smaller-input",
            "label": "They shrink the feature maps so there is less data to process at each layer.",
            "correct": false,
            "why": "Skip connections don't shrink feature maps — they add the input back. Downsampling is done by stride/pooling, a separate mechanism."
          }
        ]
      },
      "feedback": {
        "correct": "Exactly — the identity shortcut is a gradient highway and lets deep blocks safely do nothing. That is the core reason deep networks became trainable.",
        "incorrect": "Look back at out = F(x) + x. The win is gradient flow to early layers (the shortcut's gradient is 1) plus the easy identity mapping — not extra parameters or regularization."
      }
    }
  },
  {
    "id": "cv-transfer",
    "kind": "lab",
    "title": "Transfer Learning & Fine-Tuning",
    "concept": "Reuse a pretrained backbone — freeze it or fine-tune it carefully",
    "explanation": "Training a vision model from scratch needs huge data and compute. Transfer learning skips that: start from a network already trained on millions of images (e.g. ResNet on ImageNet), which has learned general features like edges, textures, and shapes. You then adapt it to YOUR task. Two main strategies: FREEZE the backbone and train only a fresh final layer (best when your dataset is small and similar to the original domain), or FINE-TUNE some or all of the backbone with a LOW learning rate (best when you have more data or a domain shift). Training from scratch is rarely the right call. The key danger when fine-tuning is catastrophic forgetting: a high learning rate can blow away the useful pretrained features before your small dataset can teach anything good back.",
    "example": {
      "text": "You have 300 photos of your 5 houseplant species. ImageNet already knows leaves, edges, and green textures. Freezing that backbone and training only a new 5-way classifier head learns in minutes on a tiny dataset — far better than training a network from scratch on 300 images, which would just overfit."
    },
    "workedExample": {
      "intro": "Use a simple decision rule based on TWO things: how much data you have, and how similar your domain is to the pretraining data.",
      "steps": [
        "Small dataset + similar domain (cats/dogs vs ImageNet): FREEZE the backbone, train only the new final layer. Few parameters to learn, low overfitting risk.",
        "Larger dataset + similar domain: FINE-TUNE the upper layers (and the head) with a LOW learning rate so you nudge features rather than destroy them.",
        "Bigger data + real domain shift (e.g. medical scans, satellite): fine-tune more of the network, still with a careful low LR or a schedule.",
        "Almost never train from scratch unless you have a massive dataset and the pretrained features are useless for your task."
      ],
      "takeaway": "Small + similar => freeze; more data or domain shift => fine-tune with a LOW learning rate to avoid catastrophic forgetting. From scratch is the rare exception."
    },
    "guided": {
      "prompt": "You have 250 labeled images across 4 bird species and want to use a ResNet pretrained on ImageNet (which already contains birds). Do you FREEZE the backbone, FINE-TUNE the whole thing aggressively, or TRAIN FROM SCRATCH?",
      "hints": [
        "250 images is a SMALL dataset, and birds are SIMILAR to ImageNet's domain.",
        "Small + similar is the textbook 'freeze the backbone, train only the head' case. Aggressive fine-tuning on tiny data risks catastrophic forgetting and overfitting."
      ],
      "answer": "Freeze the backbone and train only a new final classification layer.",
      "explanation": "With a small dataset in a domain the pretrained model already understands, the safe, efficient choice is to freeze the learned features and train just the lightweight head. Aggressive fine-tuning would risk wiping out good features (catastrophic forgetting) and overfitting on so few images; training from scratch needs far more data."
    },
    "goDeeper": {
      "title": "Why a LOW learning rate matters when fine-tuning",
      "body": "The pretrained weights are already in a good region of the loss landscape. A large learning rate takes big steps that can scatter those finely-tuned features before your small dataset provides enough signal to relearn them — catastrophic forgetting. Using a low learning rate (often 10-100x smaller than you'd use from scratch), unfreezing layers gradually, and sometimes a separate higher LR for the new head, lets the model gently adapt while preserving what it already knows."
    },
    "video": {
      "title": "Freeze or fine-tune?",
      "description": "A decision guide for transfer learning and the catastrophic-forgetting trap when fine-tuning.",
      "duration": "4:15"
    },
    "activity": {
      "type": "colab",
      "prompt": "Open the notebook, fine-tune a pretrained ResNet18 on a small image dataset, then answer the self-check.",
      "data": {
        "goal": "Adapt a pretrained ResNet18 to a small custom dataset using transfer learning, and feel the difference between freezing the backbone and fine-tuning it.",
        "steps": [
          "Runtime > Change runtime type > GPU, then run the setup cell (it installs nothing new — torch and torchvision are preinstalled in Colab).",
          "Load a pretrained ResNet18 with torchvision.models.resnet18(weights='IMAGENET1K_V1').",
          "Strategy A (FREEZE): set requires_grad=False on the backbone, replace model.fc with a new nn.Linear sized to your number of classes, and train only that head for a few epochs.",
          "Strategy B (FINE-TUNE): unfreeze the backbone and continue training, but set a LOW learning rate (e.g. 1e-4) so you don't wipe out the pretrained features.",
          "Compare validation accuracy and training time for both strategies, and watch what happens to accuracy if you crank the fine-tune learning rate up high."
        ],
        "colabUrl": "https://colab.research.google.com/",
        "kaggleUrl": "https://www.kaggle.com/code/scratchpad/notebook",
        "check": {
          "question": "You have only ~300 images in a domain ResNet already understands (everyday objects). Which setup gives the best, safest result?",
          "choices": [
            {
              "id": "freeze-head",
              "label": "Freeze the backbone and train only a new final layer (head).",
              "correct": true,
              "why": "Correct. Small dataset + similar domain is the freeze case: reuse the pretrained features and learn just the lightweight head, which is fast and resists overfitting."
            },
            {
              "id": "highlr-fullft",
              "label": "Unfreeze everything and fine-tune with a HIGH learning rate to adapt fast.",
              "correct": false,
              "why": "A high LR on tiny data causes catastrophic forgetting — it scatters the good pretrained features before 300 images can teach anything back. Use a low LR if you fine-tune at all."
            },
            {
              "id": "scratch",
              "label": "Ignore the pretrained weights and train ResNet18 from scratch.",
              "correct": false,
              "why": "Training from scratch needs far more data than 300 images; it will badly overfit. Transfer learning exists precisely to avoid this."
            },
            {
              "id": "delete-head-only",
              "label": "Keep the original 1000-class ImageNet head and just relabel its outputs.",
              "correct": false,
              "why": "The pretrained head predicts ImageNet's 1000 classes, not yours. You must replace the final layer with one sized to your number of classes."
            }
          ]
        }
      },
      "feedback": {
        "correct": "Nicely done — small + similar means freeze the backbone and train only the head, and any fine-tuning uses a low learning rate. You used a pretrained ResNet the way professionals do.",
        "incorrect": "Re-check the rule: a small dataset in a familiar domain calls for freezing the backbone and training just a new head; fine-tuning, if used at all, needs a LOW learning rate to avoid catastrophic forgetting."
      }
    }
  },
  {
    "id": "cv-augmentation",
    "title": "Data Augmentation",
    "concept": "Stretch your dataset with transforms — but never change the label",
    "explanation": "Data augmentation creates new training examples by transforming the ones you have — flipping, cropping, rotating slightly, jittering brightness/color. It teaches the model that a cat is still a cat whether it's shifted, brighter, or mirrored, which improves generalization for free. The golden rule: an augmentation is only SAFE if it does NOT change the correct label. Whether a transform is safe is task-dependent. A horizontal flip is harmless for 'cat vs dog' but corrupts a handwritten '6' (it becomes a mirror image), a traffic sign (a left-turn arrow becomes a right-turn arrow), or text. Converting to grayscale is fine for shape-based tasks but destroys a 'ripe vs unripe fruit' task that depends on color.",
    "example": {
      "text": "Horizontally flip a photo of a dog: still obviously a dog — safe. Horizontally flip the digit '6': it now looks like a mirrored shape that is no longer a clean '6' — the label is wrong, so the flip is UNSAFE for digit recognition. Same transform, opposite verdict, because the task is different."
    },
    "workedExample": {
      "intro": "For each transform, ask one question: does the LABEL still hold after it? Watch me judge a few for a cat-vs-dog photo classifier.",
      "steps": [
        "Random horizontal flip: a mirrored cat is still a cat. SAFE.",
        "Random crop / slight zoom: a partial cat is still a cat. SAFE — and it teaches the model that objects can be off-center.",
        "Small brightness/color jitter: a slightly brighter cat is still a cat. SAFE.",
        "Vertical flip (upside-down): real photos of pets are rarely upside-down, so this teaches an unrealistic view — usually UNSAFE/unhelpful for natural photos, even though the label technically holds."
      ],
      "takeaway": "Safe augmentations preserve the label and stay realistic for the task; if a transform could flip the correct answer, it is unsafe."
    },
    "guided": {
      "prompt": "You're building a classifier for handwritten digits (0-9) and want to add a RANDOM HORIZONTAL FLIP augmentation. Good idea?",
      "hints": [
        "Ask the golden rule: does the label survive a horizontal flip for every digit?",
        "Flip a '2', a '3', a '6' or a '7' — a mirrored digit is no longer that digit (and 6 vs 9 confusion gets worse)."
      ],
      "answer": "No — horizontal flip is UNSAFE for digit recognition.",
      "explanation": "Many digits are not left-right symmetric, so a horizontal flip produces a shape with a different (or invalid) label. The model would be taught wrong answers. Safe alternatives for digits include small rotations, slight shifts, and minor scaling."
    },
    "goDeeper": {
      "title": "Augmentation is task knowledge, not a fixed recipe",
      "body": "The reason there is no universal augmentation list is that 'does the label change?' depends entirely on what you're predicting. Horizontal flip: fine for animals, fatal for text/signs/digits. Grayscale: fine for shape tasks, fatal for 'ripe vs unripe' or 'is this wire red or green?'. Heavy rotation: fine for satellite imagery (no up), wrong for street scenes (the sky should be up). Choosing augmentations forces you to state, precisely, what is and isn't allowed to vary in your problem — which is genuine domain knowledge."
    },
    "video": {
      "title": "Safe vs unsafe augmentation",
      "description": "Why flipping a cat is fine but flipping a '6' is a bug, and how to judge any transform.",
      "duration": "3:40"
    },
    "activity": {
      "type": "sort",
      "prompt": "For a HANDWRITTEN-DIGIT classifier (0-9), sort each augmentation into Safe (label stays correct) or Unsafe (could change the label).",
      "data": {
        "buckets": [
          {
            "id": "safe",
            "label": "Safe (label preserved)"
          },
          {
            "id": "unsafe",
            "label": "Unsafe (label could change)"
          }
        ],
        "tokens": [
          {
            "id": "small-rotate",
            "label": "Rotate by a few degrees",
            "bucket": "safe"
          },
          {
            "id": "shift",
            "label": "Shift a few pixels",
            "bucket": "safe"
          },
          {
            "id": "zoom",
            "label": "Slight zoom / scale",
            "bucket": "safe"
          },
          {
            "id": "brightness",
            "label": "Small brightness change",
            "bucket": "safe"
          },
          {
            "id": "hflip",
            "label": "Horizontal flip (mirror)",
            "bucket": "unsafe"
          },
          {
            "id": "vflip",
            "label": "Vertical flip (upside-down)",
            "bucket": "unsafe"
          },
          {
            "id": "rotate180",
            "label": "Rotate 180° (turns 6 into 9)",
            "bucket": "unsafe"
          }
        ]
      },
      "feedback": {
        "correct": "Spot on — small geometric and brightness changes keep a digit's identity, but flips and 180° rotation turn digits into other digits (6 <-> 9) or invalid shapes. Augmentation safety is always about whether the label survives.",
        "incorrect": "Test each one on a real digit: does a '6' or '2' still mean the same thing afterward? Tiny rotations/shifts/brightness are safe; mirroring or flipping a digit changes its label."
      }
    }
  },
  {
    "id": "cv-detect-segment",
    "title": "Detection & Segmentation Overview",
    "concept": "Classification vs detection vs segmentation — different questions, different outputs",
    "explanation": "Image tasks differ by WHAT the model outputs. Classification answers 'what is in this image?' with a single label for the whole image (e.g. 'cat'). Object detection answers 'what objects are here AND where?' by outputting a class plus a bounding BOX around each object (e.g. 'cat at this rectangle, dog at that one'). Semantic/instance segmentation goes finer still: it labels EVERY PIXEL, producing a precise mask of which pixels belong to which object — outlining the exact shape, not just a box. As you move classification -> detection -> segmentation, the output gets richer and more precise (and labeling the training data gets much more expensive).",
    "example": {
      "text": "Photo of a street: Classification says 'street scene' (one label). Detection draws boxes: 'car here, pedestrian there, traffic light up here.' Segmentation colors every pixel — road pixels, car pixels, pedestrian pixels — so a self-driving car knows the exact drivable area, not just a rough box."
    },
    "workedExample": {
      "intro": "Match each task to its OUTPUT, from coarse to fine. The output shape is the giveaway.",
      "steps": [
        "Classification: one label for the whole image. Output = a class name. Coarsest.",
        "Object detection: a list of (class + bounding box) pairs. Output = boxes with labels. Tells you WHERE, roughly.",
        "Segmentation: a per-pixel label map (a mask). Output = an exact outline of each object. Finest and most precise.",
        "Rule of thumb: more precise output => more expensive labels. Drawing pixel masks takes far longer than tagging boxes, which takes longer than one image-level label."
      ],
      "takeaway": "Classification = one label; detection = labeled boxes (where); segmentation = per-pixel masks (exact shape). Richer output, costlier labels."
    },
    "guided": {
      "prompt": "A medical app must measure the EXACT area of a tumor in a scan, down to its precise outline. Which task is this — classification, detection, or segmentation?",
      "hints": [
        "Ask what the OUTPUT must be: a label? a box? or a precise pixel-level outline?",
        "Measuring exact area needs the precise shape, which means a per-pixel mask."
      ],
      "answer": "Segmentation — it produces a per-pixel mask of the tumor.",
      "explanation": "A bounding box only gives a rough rectangle, and a single label gives no location at all. Measuring exact area requires knowing which pixels are tumor, which is exactly what segmentation outputs."
    },
    "goDeeper": {
      "title": "Why detection and segmentation are 'harder'",
      "body": "Classification has one output per image, so labeling is cheap and the model just needs a global summary. Detection must localize an unknown NUMBER of objects and regress box coordinates, so it juggles many predictions per image. Segmentation must decide a label for every one of potentially millions of pixels, and its training masks are painstaking to draw by hand. That progression — global label, then boxes, then pixels — is why each step needs more sophisticated models (e.g. region proposals, mask heads) and far more expensive annotation."
    },
    "video": {
      "title": "Three ways to look at an image",
      "description": "Classification, detection, and segmentation compared by what each one outputs.",
      "duration": "3:55"
    },
    "activity": {
      "type": "sort",
      "prompt": "Sort each requirement into the vision task it needs: Object detection (labeled boxes) or Segmentation (per-pixel masks).",
      "data": {
        "buckets": [
          {
            "id": "detection",
            "label": "Detection (labeled boxes)"
          },
          {
            "id": "segmentation",
            "label": "Segmentation (per-pixel masks)"
          }
        ],
        "tokens": [
          {
            "id": "count-people",
            "label": "Count how many people are in a photo",
            "bucket": "detection"
          },
          {
            "id": "box-cars",
            "label": "Draw a box around each car for a parking app",
            "bucket": "detection"
          },
          {
            "id": "locate-faces",
            "label": "Locate each face roughly to crop thumbnails",
            "bucket": "detection"
          },
          {
            "id": "tumor-area",
            "label": "Measure a tumor's exact area and outline",
            "bucket": "segmentation"
          },
          {
            "id": "drivable-road",
            "label": "Mark every road pixel for a self-driving car",
            "bucket": "segmentation"
          },
          {
            "id": "background-cutout",
            "label": "Cut a person out precisely to swap the background",
            "bucket": "segmentation"
          }
        ]
      },
      "feedback": {
        "correct": "Exactly — counting and rough 'where is it' needs labeled boxes (detection), while exact outlines, areas, and pixel-perfect cutouts need per-pixel masks (segmentation). The required OUTPUT decides the task.",
        "incorrect": "Ask what output each job needs: a rough box around each object (detection) or an exact pixel-level outline/area (segmentation). 'Count' or 'roughly locate' = detection; 'exact area / precise cutout' = segmentation."
      }
    }
  },
  {
    "id": "cv-failures",
    "title": "When Vision Models Fail",
    "concept": "Distribution shift, spurious features, and occlusion",
    "explanation": "A vision model is only as honest as the photos it trained on. It learns whatever pattern best separates the training images — and sometimes that pattern is a shortcut, not the real object. When new photos look different from training (distribution shift), lean on a background cue that happens to correlate with the label (spurious feature), or hide part of the object (occlusion), confident-looking predictions quietly fall apart.",
    "example": {
      "text": "A 'wolf vs husky' classifier scored beautifully in testing — then failed in the wild. It had learned 'snow in the background = wolf,' because almost every wolf photo was taken in snow. Put a husky on snow and it screams 'wolf.' The model never really learned what a wolf looks like; it learned the background."
    },
    "workedExample": {
      "intro": "Three failures look identical from the outside — a wrong, confident answer — but they have different root causes. Watch how I name each one by asking: did the INPUT change, did the model lean on the WRONG cue, or is part of the object MISSING?",
      "steps": [
        "A model trained on bright daytime road photos starts mislabeling signs at dusk and in rain. The signs are normal — the lighting and weather are new. The data shifted away from what it trained on. That is DISTRIBUTION SHIFT.",
        "A 'cow' detector works on pasture photos but fails on a cow at the beach. Digging in, almost every training cow stood on grass, so the model secretly keyed on 'green grass.' It latched onto a correlated background cue, not the cow. That is a SPURIOUS FEATURE.",
        "A face-unlock model trained on full faces refuses to recognize you when a scarf covers your nose and mouth. The object is right and the scene is normal — but half of it is hidden. That is OCCLUSION.",
        "Notice the fix differs each time: shift needs more varied data (night, rain); spurious needs data that breaks the bad correlation (cows on sand, snow-free wolves); occlusion needs partial-view examples in training."
      ],
      "takeaway": "Ask three questions to diagnose a vision failure: did the input distribution change (shift), did the model lean on a correlated-but-irrelevant cue (spurious), or is the object partly hidden (occlusion)?"
    },
    "guided": {
      "prompt": "Let's diagnose one together.\n\nA skin-lesion classifier reaches 95% accuracy. Investigators find that in the training set, almost every malignant photo happened to include a ruler placed next to the lesion (doctors measure dangerous ones). The model flags any photo with a ruler as malignant. What kind of failure is this?",
      "hints": [
        "The input photos themselves look normal and nothing is hidden — so it is not distribution shift or occlusion.",
        "Ask: is the model using the actual lesion, or something that merely CORRELATES with the label in the training data?",
        "A ruler is not part of the skin. It just happened to appear next to dangerous lesions. The model took a shortcut on a background cue."
      ],
      "answer": "A spurious feature — the model learned 'ruler present = malignant' instead of learning the lesion itself.",
      "explanation": "The ruler is a spurious (correlated-but-irrelevant) feature. It separated the training classes by accident, so the model leaned on it. The cure is data that breaks the correlation: malignant photos WITHOUT rulers and benign photos WITH them, forcing the model back onto the lesion."
    },
    "goDeeper": {
      "title": "Why models love shortcuts",
      "body": "Gradient descent is lazy in a useful-then-dangerous way: it finds the EASIEST pattern that lowers training loss. If 'snow' or 'ruler' separates the classes with less effort than learning true shape and texture, the model takes the shortcut and stops. This is why high test accuracy can be a lie when the test set shares the same shortcut. Robust evaluation means testing on data where the shortcut is deliberately broken (a husky on snow, a cow on sand) — that is exactly the spirit of a 'break-it' study you'll do in the project."
    },
    "video": {
      "title": "How confident models fail",
      "description": "A tour of three real-world vision failures — distribution shift, spurious shortcuts, and occlusion — and how to tell them apart.",
      "duration": "3:20"
    },
    "activity": {
      "type": "scenario",
      "prompt": "Read each failure report and label the SINGLE root cause that best fits.",
      "data": {
        "scenario": "A self-driving research team logs a worrying incident. Their pedestrian detector was trained almost entirely on photos of people walking upright in clear daylight. In the failure, a person is crouching to tie a shoe behind a parked car, so only their head and shoulders are visible, at dusk. The team wants ONE primary label for a quick triage tag. They argue between three causes. Pick the BEST single tag for the dominant cause of THIS specific miss.",
        "multi": false,
        "choices": [
          {
            "id": "occlusion",
            "label": "Occlusion — most of the body is hidden behind the parked car, so the detector only sees a partial person it never trained on.",
            "correct": true,
            "why": "The defining feature of this miss is that the object is physically hidden — only head and shoulders show. Even a model robust to lighting would struggle with a body it can't see. The fix is training on partial-view crops and behind-object examples."
          },
          {
            "id": "shift",
            "label": "Distribution shift — it's dusk, and training was daylight, so the lighting moved off-distribution.",
            "correct": false,
            "why": "Dusk lighting is a real contributing factor and a genuine distribution shift, but it's secondary here. The dominant, decisive problem is that the pedestrian is mostly hidden — a crouched, occluded body would be hard even in perfect daylight."
          },
          {
            "id": "spurious",
            "label": "Spurious feature — the model learned 'parked car nearby = no pedestrian.'",
            "correct": false,
            "why": "Nothing in the report shows the model relied on a correlated background cue like cars meaning 'no person.' We'd need evidence the model keys on the car itself. The visible, immediate cause is the hidden body — that's occlusion."
          }
        ]
      },
      "feedback": {
        "correct": "Exactly — the body is physically hidden, so this is occlusion first. Dusk is a real second factor, but you triage by the dominant cause: a model can't classify what it can't see.",
        "incorrect": "Re-read what's actually visible: only head and shoulders, because a car hides the rest. That 'object is hidden' fact is occlusion — the decisive cause here. Lighting is a secondary contributor, not the primary tag."
      }
    }
  },
  {
    "id": "cv-adversarial",
    "title": "Adversarial Examples: Tiny Changes, Big Lies",
    "concept": "Imperceptible perturbations can flip a confident prediction",
    "explanation": "A CNN sees images as grids of numbers and decides by summing weighted pixel values across many filters. Because each layer is so sensitive, an attacker can add a tiny, carefully chosen amount to every pixel — far too small for a human to notice — and push that internal sum across a decision boundary. The picture looks identical to you, but the model's number tips over and the label flips. Models do not 'see' shapes the way we do; they read arithmetic.",
    "example": {
      "text": "A famous result: a clean photo of a panda is classified 'panda' with ~58% confidence. Add a faint, structured noise pattern (invisible to people — the panda looks unchanged) and the same network now says 'gibbon' with 99% confidence. Nothing a human would notice changed. The model's underlying weighted sums moved just enough to cross a boundary."
    },
    "workedExample": {
      "intro": "Let me make the mechanism concrete with one filter output. A convolution's output cell is a weighted sum of a 3x3 patch. I'll show how a perturbation so small it barely changes the picture can still swing that sum — and a swung sum is how a label flips. Watch the arithmetic, because the arithmetic is the whole attack.",
      "steps": [
        "Take a 3x3 image patch and a learned edge filter (a Sobel-style kernel). The output cell is the element-wise product of patch and kernel, all nine summed. Suppose for the clean patch that sum is a small positive number — just barely on the 'edge here' side of the boundary.",
        "Now an attacker adds a tiny perturbation aligned with the kernel's SIGNS: a touch more where the kernel is positive, a touch less where it is negative. Each pixel moves by an amount you'd never see in the image — yet every nudge pushes the SAME direction in the sum.",
        "Nine tiny aligned nudges add up. The output cell can jump far more than any single pixel changed, because the kernel amplifies coordinated changes. That is the core insight: small per-pixel changes, summed over many weights, become a large change in the model's decision value.",
        "Stack this across dozens of filters and many layers and you get the panda-to-gibbon flip: the image is visually identical, but the cumulative weighted sums crossed a class boundary."
      ],
      "takeaway": "Adversarial attacks exploit summation: a perturbation too small to see, when aligned with the model's weights, adds up across many pixels and filters into a decision-changing shift. The picture stays the same; the math doesn't."
    },
    "guided": {
      "prompt": "Let's reason about one together.\n\nAn attacker wants to fool a classifier but must keep the change invisible — every pixel may move by at most ±2 (on a 0–255 scale). They could (A) move pixels in random directions, or (B) move each pixel in the direction that the model's gradient says will most increase the wrong class. Which causes a bigger swing in the model's output, and why?",
      "hints": [
        "Both options change pixels by the same tiny maximum amount, so the picture looks equally unchanged either way.",
        "Think about the worked example: nine nudges ALIGNED with the kernel's signs all push the sum the same way; random nudges partly cancel out.",
        "The gradient tells the attacker exactly which direction each pixel should move to push the model's decision. That's the aligned, non-cancelling version."
      ],
      "answer": "B — moving each pixel along the model's gradient causes a far bigger swing, even though the per-pixel change is just as invisible as random noise.",
      "explanation": "Random nudges scatter in different directions and largely cancel when summed by the model's weights, so the decision barely moves. Gradient-aligned nudges all push the same way through the weighted sums, so they accumulate into a large shift — enough to flip the label while staying invisible. This is exactly why adversarial examples are so unsettling: same picture to us, totally different math to the model."
    },
    "goDeeper": {
      "title": "Why this isn't just a bug",
      "body": "Adversarial examples reveal something deep: a model's decision boundary lives in a very high-dimensional pixel space, and most of that space is nowhere near real photos. A natural image sits on a thin 'manifold' of plausible pictures; you can step a tiny distance OFF that manifold — invisible to humans, who only recognize on-manifold images — and land in a region where the model behaves arbitrarily. Defenses exist (adversarial training, input smoothing, randomized preprocessing) but none is bulletproof, which is why adversarial robustness is an active safety concern for any vision system that faces an adversary — from spam image filters to autonomous driving."
    },
    "video": {
      "title": "The panda that became a gibbon",
      "description": "How an invisible perturbation flips a confident prediction, and what it tells us about how models really 'see.'",
      "duration": "3:05"
    },
    "activity": {
      "type": "featuremap",
      "prompt": "Run the attack yourself. Drag the perturbation strength (ε) up from 0. Watch the image stay visually almost identical while the model's prediction — and its confidence — swing, then flip to the wrong class. Then answer the question.",
      "data": {
        "mode": "adversarial",
        "base": [
          [4, 5, 4, 5, 4],
          [5, 4, 5, 4, 5],
          [4, 5, 4, 5, 4],
          [5, 4, 5, 4, 5],
          [4, 5, 4, 5, 4]
        ],
        "trueLabel": "panda",
        "wrongLabel": "gibbon",
        "maxEps": 8,
        "flipAt": 5,
        "check": {
          "question": "At ε = 0 the model says 'panda'. As you raise ε the picture barely changes, yet past a threshold it confidently says 'gibbon'. What does this demonstrate about how the model 'sees'?",
          "choices": [
            {
              "id": "aligned",
              "label": "A perturbation too small for a human to notice, when aligned with the model's weights, accumulates across many pixels and filters into a decision-changing shift — so the label flips while the image looks the same.",
              "correct": true,
              "why": "Exactly the mechanism from the worked example: each pixel moves by an invisible amount, but because the nudges are aligned with the weights they all push the weighted sums the same way. Summed over many pixels and filters, that becomes a large change in the decision value — enough to cross a class boundary. Same picture to us, different math to the model."
            },
            {
              "id": "random",
              "label": "The model is just unstable — any random noise of that size would flip the prediction, so this isn't really an 'attack'.",
              "correct": false,
              "why": "Random noise of the same tiny size scatters in all directions and largely cancels when the model sums it, so the decision barely moves. The danger here is that the perturbation is ALIGNED with the gradient/weights — that's what makes it accumulate instead of cancel."
            },
            {
              "id": "visible",
              "label": "The image must have changed a lot — you just can't see it on a small grid.",
              "correct": false,
              "why": "The per-pixel change is genuinely tiny (±1 here, the famous result uses changes invisible to people). The picture really is nearly identical; it's the model's internal weighted sums — not the visible image — that moved across the boundary."
            }
          ]
        }
      },
      "feedback": {
        "correct": "Right — that's the panda-to-gibbon flip in miniature. Invisible, weight-aligned per-pixel nudges accumulate through the network's sums into a confident wrong answer. Models read arithmetic, not shapes, which is why adversarial robustness is a real safety concern.",
        "incorrect": "Re-read the slider: the image stays visually the same, but the prediction flips confidently. That only happens because the perturbation is ALIGNED with the model's weights so it accumulates (random noise would cancel). Tiny aligned changes → large shift in the decision value."
      }
    }
  },
  {
    "id": "cv-project",
    "title": "Project P4: Image Classifier + Break-It Study",
    "concept": "Train a real classifier on free GPU, then break it on purpose",
    "explanation": "Time to put the whole level together on a free cloud GPU. You'll fine-tune a pretrained CNN (transfer learning) on a small image dataset, get it working, and then deliberately attack your own model: feed it distribution-shifted, spuriously-cued, occluded, and lightly-perturbed images and document where and why it breaks. A model you can break on purpose is a model you actually understand.",
    "example": {
      "text": "Think of it like crash-testing a car you just built. Getting 92% accuracy on the clean test set is the easy, satisfying part. The real learning is when you grayscale the images, crop out half the object, or add faint noise — and watch confidence stay high while the answer goes wrong. Those break-it cases are the story you write up."
    },
    "workedExample": {
      "intro": "Here's the shape of a clean break-it study, narrated. The goal isn't just accuracy — it's a clear before/after that shows you WHY the model fails, mapping each failure back to the concepts from this module.",
      "steps": [
        "Train smart, not from scratch: load a pretrained ResNet-style backbone, FREEZE it, and train only a new final layer on your small dataset. Small data + similar domain means freezing is the right call — and it trains in minutes on a free GPU.",
        "Measure the clean baseline: record accuracy and a few confident correct predictions. This is your control group — you can't show 'broken' without a 'working' to compare against.",
        "Run the break-it battery: (a) distribution shift — test on darker/blurrier or grayscale versions; (b) spurious check — swap or blank backgrounds and see if the label follows the background; (c) occlusion — mask a patch over the object; (d) tiny perturbation — add small noise and look for confident flips.",
        "Write it up: for each broken case, name the cause using this module's vocabulary (shift / spurious / occlusion / adversarial), note whether confidence stayed high, and propose ONE concrete fix (more varied data, correlation-breaking data, occlusion crops in training, or adversarial training)."
      ],
      "takeaway": "A complete project is baseline + break-it + diagnosis: get it working with transfer learning, then break it four ways and explain each failure in the module's own terms with a proposed fix."
    },
    "guided": {
      "prompt": "Before you open the notebook, lock in the training strategy.\n\nYour dataset is small (about 200 images per class) and the classes (cats vs dogs) are very close to what the pretrained ImageNet backbone already knows. Should you (A) train the whole network from random weights, (B) freeze the backbone and train only the new final layer, or (C) unfreeze everything and fine-tune all layers at a high learning rate?",
      "hints": [
        "Recall the transfer-learning rule: small dataset + similar domain points strongly toward freezing.",
        "Training from scratch needs far more than ~200 images per class — it would badly overfit.",
        "A high learning rate on all layers risks catastrophic forgetting — wrecking the useful features the backbone already learned."
      ],
      "answer": "B — freeze the pretrained backbone and train only a fresh final layer.",
      "explanation": "With little data and a similar domain, the backbone's general features (edges, textures, shapes) already transfer, so you only need to learn the new decision layer on top. Training from scratch (A) overfits badly on ~200 images. Fine-tuning everything at a high LR (C) risks catastrophic forgetting — erasing the very features that make transfer learning work. If you later add lots more data or face a big domain shift, THEN fine-tune deeper layers with a LOW learning rate."
    },
    "goDeeper": {
      "title": "What makes a break-it study credible",
      "body": "Two habits separate a convincing study from a hand-wave. First, change ONE thing at a time: if you grayscale AND occlude at once, you can't attribute the failure. Isolate each stressor so each failure maps to a single named cause. Second, always log CONFIDENCE alongside the prediction. The scary, report-worthy cases aren't the ones where the model is unsure — they're where it's confidently wrong (high softmax on the wrong class), because that's what slips past monitoring in production. A good writeup pairs each failure with its cause, its confidence, and a single, specific fix."
    },
    "video": {
      "title": "Crash-testing your own model",
      "description": "Walkthrough of a transfer-learning classifier and a four-way break-it study, from clean baseline to confident failures.",
      "duration": "4:10"
    },
    "kind": "lab",
    "activity": {
      "type": "colab",
      "prompt": "Open the notebook on a free GPU, train your classifier with transfer learning, run the break-it battery, then answer the self-check to log your finding.",
      "data": {
        "goal": "Fine-tune a pretrained CNN on a small image dataset, establish a clean baseline, then deliberately break it four ways (shift, spurious, occlusion, perturbation) and write up each failure with its cause and a fix.",
        "steps": [
          "Open the notebook and switch the runtime to GPU (in Colab: Runtime → Change runtime type → GPU; in Kaggle: enable a GPU accelerator).",
          "Load a small image dataset (the provided cats-vs-dogs subset, ~200 images/class) and split it into train/validation.",
          "Load a pretrained ResNet backbone, FREEZE it, and attach a fresh final classification layer for your classes.",
          "Train only the final layer for a few epochs; record clean validation accuracy and save 3 confident correct predictions as your baseline.",
          "Break-it battery, one stressor at a time: (a) grayscale or darken the test images (distribution shift); (b) blank or swap backgrounds (spurious-feature check); (c) mask a patch over the animal (occlusion); (d) add faint random noise (a simple perturbation).",
          "For every break-it case, log the new prediction AND its confidence, then label the cause using this module's vocabulary and propose one concrete fix.",
          "Write a short scenario writeup: baseline accuracy, your most interesting confident-but-wrong failure, its named cause, and the fix you'd ship."
        ],
        "colabUrl": "https://colab.research.google.com/",
        "kaggleUrl": "https://www.kaggle.com/code",
        "check": {
          "question": "In your break-it study, the model stays 96% confident 'dog' on an image where you blanked the grassy background to plain white — and it's actually a cat. The clean version was correct. Which writeup BEST captures this finding?",
          "choices": [
            {
              "id": "spurious",
              "label": "Spurious feature: the model leaned on the background (grass/outdoor cues correlated with 'dog' in training); removing it confused it while confidence stayed high. Fix: add training images that break the background-class correlation.",
              "correct": true,
              "why": "Blanking the background — not the animal — changed the prediction, which is the signature of a spurious background cue. High confidence on the wrong class is exactly the dangerous, report-worthy case. The right fix breaks the correlation with more varied backgrounds per class."
            },
            {
              "id": "adversarial",
              "label": "Adversarial example: an imperceptible perturbation flipped the label.",
              "correct": false,
              "why": "Blanking a background is a large, fully visible change, not an invisible per-pixel perturbation. Adversarial examples are tiny and aligned with the model's gradient; this is a spurious-feature failure instead."
            },
            {
              "id": "occlusion",
              "label": "Occlusion: part of the animal was hidden, so the model lost the object.",
              "correct": false,
              "why": "You changed the background, not the animal — the cat itself is fully visible. Occlusion is when the OBJECT is hidden. Here the model followed the background, which is a spurious feature."
            },
            {
              "id": "shift",
              "label": "Distribution shift: the lighting and weather moved off-distribution.",
              "correct": false,
              "why": "Nothing about lighting or weather changed — only the background content. The decisive clue is that swapping the background (not the scene conditions) flipped the label, pointing to a spurious feature."
            }
          ]
        }
      },
      "feedback": {
        "correct": "That's the heart of a break-it study: a confident-but-wrong prediction, the right cause (spurious background cue), and a fix that breaks the correlation. You can now train a model AND explain exactly how to break it.",
        "incorrect": "Focus on what you changed: only the background, and the animal is fully visible. Changing the background — not the object or the scene conditions — and flipping the label is the fingerprint of a spurious feature."
      }
    }
  }
]
