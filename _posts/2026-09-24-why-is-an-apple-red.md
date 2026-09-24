---
title: "Why is an apple red? (And what happens when you take the red away)"
---
A few questions have been bothering me for a while:

1. How does anything take colour?
2. An apple which is not fully grown looks green, and as time passes its colour changes. How?
3. When an apple decays it turns dark. Is that because the cells are being destroyed and there are fewer cells left to reflect light?
4. If an apple is pure red in sunlight, how will it look under a light which has no trace of red in it, say a monochromatic yellow source?

I also had my own guess for the third one, which I will come back to, because it turned out to be wrong in an interesting way.

In my PhD I work with electromagnetic waves, mostly at a few megahertz, for wireless power transfer. Light is the same thing, just at a much higher frequency. Red light with a wavelength of $$\lambda = 600$$ nm oscillates at

$$
f = \frac{c}{\lambda} = \frac{3 \times 10^{8}\ \text{m/s}}{600 \times 10^{-9}\ \text{m}} = 5 \times 10^{14}\ \text{Hz},
$$

i.e. 500 THz. So, this topic is not too far from home for me.

## How does anything take colour?

Sunlight contains all the wavelengths our eyes can see, typically from 380 to 700 nm[^nasa]. When this light hits an object, the molecules in it absorb some wavelengths and send the rest back (or let them through). Whatever comes back and enters our eye is what we call the colour of the object.

A leaf is the classic example. Chlorophyll absorbs mainly in the blue (400--500 nm) and the red (650--680 nm), and only a little in the green, around 530 nm. So green light is scattered back out of the leaf, and the leaf looks green[^vangrondelle].

There is a second half to this story, which sits in our eyes. We have three types of cone cells whose sensitivities peak at about 440 nm (S-cones), 545 nm (M-cones), and 565 nm (L-cones)[^kalloniatis]. The brain doesn't receive a full spectrum; it receives three numbers, i.e. how strongly each type of cone fired, and it builds the sensation of colour out of them. Keep this in mind, it will come back to bite us in the last section.

> **Going a bit deeper: why does a molecule absorb only some colours?**
>
> Light gets absorbed when its energy exactly matches the energy an electron in the molecule needs to jump to a higher level. Most small molecules need so much energy that they only absorb ultraviolet, which is why they look colourless. But in molecules with long chains of alternating single and double bonds (called *conjugated* systems), the electrons are spread over the whole chain. The more spread out (delocalised) they are, the smaller the energy gap, and the longer the wavelength they absorb[^clark]. Beta-carotene, the pigment in carrots, has 11 conjugated double bonds, absorbs with a peak around 470 nm (blue), and therefore looks orange[^clark]. Chlorophyll and the red pigments of apples both have such conjugated structures, and that is exactly why they absorb in the visible range and not in the UV.

## Why does a green apple turn red?

An unripe apple is green for the same reason a leaf is green: its skin is full of chlorophyll. As the apple ripens, two things happen in the skin at the same time.

First, the green goes away. Chlorophyll is broken down during ripening into colourless compounds called phyllobilins; this has been tracked in the peel of 'Gala' apples during their shelf life[^gorfer]. Extension guides for growers describe the same thing from the outside: as the fruit ripens, "the green background color fades"[^umd].

Second, the red is built. At the same time, the skin cells start producing anthocyanins, the same family of pigments that colour red cabbage and blueberries. In apple skin, one anthocyanin, cyanidin 3-galactoside, accounts for more than 85% of the total[^honda]. Measurements of light reflected by apple peel show that anthocyanins absorb near 550 nm[^merzlyak], i.e. in the green. Take the green out of sunlight and what comes back is mostly red.

The figure below is a sketch of what this looks like as a spectrum.

<figure>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="fig1title fig1desc" style="width:100%;height:auto;max-width:640px;font-family:inherit">
  <title id="fig1title">Reflectance of green and red apple skin (schematic)</title>
  <desc id="fig1desc">Schematic reflectance curves across the visible spectrum. Green apple skin reflects most around 550 nm and dips near 670 nm. Red apple skin reflects very little below 600 nm and a lot above 620 nm. A dashed line at 589 nm marks the sodium lamp, where the red apple reflects almost nothing.</desc>
  <defs>
    <linearGradient id="spectrum" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#8b00ff"/>
      <stop offset="18.5%" stop-color="#0050ff"/>
      <stop offset="33%" stop-color="#00c8ff"/>
      <stop offset="44%" stop-color="#00d000"/>
      <stop offset="63%" stop-color="#e0f000"/>
      <stop offset="70%" stop-color="#ffb000"/>
      <stop offset="81%" stop-color="#ff4000"/>
      <stop offset="100%" stop-color="#b00000"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="1" opacity="0.7">
    <line x1="60" y1="250" x2="600" y2="250"/>
    <line x1="60" y1="30" x2="60" y2="250"/>
  </g>
  <rect x="60" y="256" width="540" height="10" fill="url(#spectrum)"/>
  <g fill="currentColor" font-size="13" text-anchor="middle">
    <text x="60" y="284">400</text>
    <text x="240" y="284">500</text>
    <text x="420" y="284">600</text>
    <text x="600" y="284">700</text>
    <text x="330" y="306">wavelength (nm)</text>
    <text x="22" y="140" transform="rotate(-90 22 140)">light reflected</text>
  </g>
  <polyline fill="none" stroke="#3a9d3a" stroke-width="3" stroke-linejoin="round"
    points="60,233 132,233 204,225 258,187 294,162 330,156 366,166 420,187 474,204 528,225 555,227 582,187 600,156"/>
  <polyline fill="none" stroke="#c0282d" stroke-width="3" stroke-linejoin="round"
    points="60,237 204,240 276,242 330,244 384,240 420,229 456,198 492,166 528,156 564,145 600,135"/>
  <line x1="400" y1="30" x2="400" y2="250" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
  <g font-size="13" fill="currentColor">
    <text x="406" y="44">sodium lamp, 589 nm</text>
  </g>
  <g font-size="14" font-weight="600">
    <text x="300" y="146" fill="#3a9d3a">green apple</text>
    <text x="470" y="130" fill="#c0282d">red apple</text>
  </g>
</svg>
</figure>

*Figure 1. A schematic, not measured data. The dip of the green curve near 670 nm is chlorophyll absorbing red; the red curve stays low wherever anthocyanin absorbs (around 550 nm) and rises only beyond about 600 nm. The shapes follow the absorption bands reported by Merzlyak et al.[^merzlyak] Ignore the dashed line for now.*

What decides *when* the apple starts making red? It turns out there is a master switch: a gene called MdMYB10. It codes for a protein which turns on all the genes needed to make anthocyanin. Espley and co-workers showed that its activity rises exactly when the colour forms, and that apple plants engineered to make more of it become highly pigmented[^espley]. The two most interesting things I learned about this switch are about the weather:

1. It needs sunlight. No anthocyanin is made in darkness[^honda], and more sunlight gives more pigment in the peel, up to a point[^chen]. This is probably why the side of an apple facing the sun is usually redder than the side facing the tree.
2. It likes cold nights. Heating apples on the tree dramatically reduced both the pigment and the activity of MYB10, while a *single* night of low temperatures was enough to give a large boost to MYB10[^linwang]. That is why apples grown in hot climates tend to colour poorly.

And if the apple is yellow, like Golden Delicious, the chlorophyll still leaves but very little anthocyanin is made, so the yellow carotenoids which were hiding under the green all along get to show up (apple skin colour depends on chlorophyll and carotenoids too, not only anthocyanin[^honda]).

One more thing, which is important for the next section: an apple doesn't stop ripening once it is picked. Apple is a *climacteric* fruit. Such fruits can ripen after harvest, and during ripening they breathe faster and release a burst of ethylene, a gas which acts as a ripening hormone and triggers even more of itself[^umd]. Some varieties produce so much of it that they soften and age quickly in storage[^umaine]. So the apple in your fruit basket is very much alive.

## My hypothesis about decay, and why it is wrong

This was my guess:

> If there are chemical combinations going on continuously and the cells are being destroyed when the fruit is picked from the tree, then there will be fewer cells to reflect the light, so blackening of the fruit, which we call decay, takes place, i.e. more absorption and less reflection.

It sounds reasonable. The last part is even right: a brown apple *does* absorb more and reflect less. But the reason is not that cells go missing. Here is why.

First, the time scale doesn't fit. Cut an apple and leave it on the table: the surface turns brown in minutes. No significant number of cells disappears in a few minutes, so something must be getting added.

And what gets added is a new pigment. Inside an apple cell, the enzyme polyphenol oxidase (PPO) sits in small compartments called plastids, while its raw material, the phenolic compounds, is stored in the vacuole. In a healthy cell the two never meet, so there is no browning. When the compartments break, by cutting, bruising, insects, or simply by ageing, the enzyme meets the phenolics in the presence of oxygen and turns them into quinones, which then chemically link up into brown polymers[^murata]. The same mechanism is behind the browning of fresh-cut apple, puree, and juice, which the food industry spends a lot of effort to prevent[^arnold].

<figure>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="fig2title fig2desc" style="width:100%;height:auto;max-width:640px;font-family:inherit">
  <title id="fig2title">Why a cut apple turns brown</title>
  <desc id="fig2desc">Left: an intact cell where the phenolics in the vacuole and the PPO enzyme in a plastid are kept apart by membranes. Right: a damaged cell where they mix with oxygen and form brown pigments.</desc>
  <g fill="none" stroke="currentColor" stroke-width="2">
    <rect x="30" y="40" width="250" height="140" rx="30"/>
    <path d="M360 40 h70 l12 14 l14 -14 h124 a30 30 0 0 1 30 30 v30 l-14 10 l14 12 v38 a30 30 0 0 1 -30 30 h-190 l-10 -12 l-12 12 a30 30 0 0 1 -8 -2 a30 30 0 0 1 -30 -30 v-80 a30 30 0 0 1 30 -30 z"/>
  </g>
  <ellipse cx="120" cy="110" rx="70" ry="45" fill="#8fb3e0" fill-opacity="0.35" stroke="currentColor" stroke-width="1.5"/>
  <ellipse cx="230" cy="110" rx="32" ry="20" fill="#7fbf7f" fill-opacity="0.45" stroke="currentColor" stroke-width="1.5"/>
  <g fill="currentColor" font-size="13" text-anchor="middle">
    <text x="120" y="106">vacuole:</text>
    <text x="120" y="123">phenolics</text>
    <text x="230" y="106">plastid:</text>
    <text x="230" y="123">PPO</text>
    <text x="155" y="26" font-weight="600">healthy cell: kept apart</text>
    <text x="485" y="26" font-weight="600">cut or bruised: they meet</text>
    <text x="155" y="206">no browning</text>
    <text x="485" y="206">phenolics + PPO + oxygen → quinones → brown pigment</text>
  </g>
  <g fill="#8b5a2b">
    <circle cx="420" cy="90" r="7"/><circle cx="455" cy="120" r="9"/><circle cx="500" cy="85" r="6"/>
    <circle cx="530" cy="135" r="8"/><circle cx="480" cy="150" r="6"/><circle cx="560" cy="95" r="7"/>
    <circle cx="410" cy="140" r="6"/><circle cx="515" cy="110" r="5"/>
  </g>
</svg>
</figure>

*Figure 2. Enzymatic browning in one picture, following Murata[^murata].*

The best evidence is an apple which doesn't brown. The Arctic apple is a genetically engineered apple in which four PPO genes are suppressed, and the result is a non-browning apple; it was cleared by the USDA in 2015[^usda]. If browning were about cells disappearing and reflecting less, silencing one enzyme wouldn't have stopped it.

So where did my hypothesis get it partly right? Cells breaking down *does* matter: the list of things that trigger browning includes maturation itself[^murata], because old cells have leaky membranes. But the breakdown matters because it lets two chemicals mix, not because there are fewer reflectors. More absorption, yes; less reflection, yes; but because of new absorbers.

And real rot is someone else's work, lol! The soft, watery, spreading brown patch on a stored apple is mostly fungi. The most important one is *Penicillium expansum*, which causes blue mould; it enters through fresh wounds like stem punctures, bruises, and even scratches from pickers' fingernails, and makes lesions which are soft, watery, and light brown, later covered with bluish-green spores[^janisiewicz]. So decay is the apple being eaten by fungi, and browning is the apple's own chemistry; in neither case are fewer cells the reason.

## A red apple under yellow light

Now the fun one. Suppose the apple is *pure* red: it reflects only red light and absorbs everything else. Put it under a light source which emits only yellow. There is nothing in the incoming light which the apple can reflect, so nothing comes back, and the apple looks black.

Such a light source exists and was, for a long time, hanging over our streets: the low-pressure sodium lamp. Its light is almost entirely two lines very close to each other, at 588.995 nm and 589.592 nm[^nist], the famous sodium D lines. Under this lamp there is "essentially no color rendition"[^flagstaff]: every object looks like a brighter or darker shade of the same yellow-orange. (Astronomers love these lamps for exactly this reason: all the light pollution sits at one wavelength, which is easy to filter out[^flagstaff].)

A real apple is not *pure* red, so it is not perfectly black either. Look at the dashed line in Figure 1: at 589 nm the red apple sits right at the edge of its anthocyanin absorption, so it reflects only a little. Under a sodium lamp it would look like a dark, dull, brownish version of the lamp's colour. A green apple reflects more at 589 nm, so it would likely look *brighter* than the red one. You would no longer be able to tell a red apple from a green apple by colour at all; only by how bright or dark it is.

### Don't test this with your phone

Here is the trap, and this is where the three cones come back. If you open a picture of plain yellow on your phone and hold an apple in front of it, the apple will still look reddish. Why? Because your screen has no yellow light. Each pixel has only red, green, and blue sub-pixels, and "yellow" on a screen is red plus green light at the same time. Our eyes can't tell the difference: all that matters is how strongly the M and L cones fire, and a suitable mix of red and green makes them fire just like pure 589 nm light does. This is the whole reason almost any colour can be matched by mixing three primaries[^kalloniatis]. Two lights with completely different spectra look the same to us, but the apple is not fooled: it reflects the red part of your "yellow" screen and looks red.

So to do this experiment properly, you need truly monochromatic light:

1. A sodium lamp, if you can still find one.
2. A sodium flame. Sprinkle a pinch of table salt into a gas flame (a gas stove works) in a dark room. The bright yellow you see is the same sodium D-line emission[^nist]. It is not very bright, so keep the apple close, and be careful with the fire.
3. A narrow-band filter around 589 nm in front of a white torch, if you happen to have one in a lab.

Put a red apple, a green apple, and something white next to each other and watch the colours drain out. I'd love to see your photos if you try this :)

## So, how does anything take colour?

Putting it all together: an object's colour is the part of the light which it doesn't absorb, as decoded by three types of cells in our eyes. An apple is green when chlorophyll is taking out the red and blue, red when anthocyanin is taking out the green, and brown when broken cells let an enzyme make a new pigment which takes out almost everything. Change the light and the colour changes with it.

Until next time.

---

## References

[^nasa]: NASA Science, "Visible Light." <https://science.nasa.gov/ems/09_visiblelight/>

[^vangrondelle]: R. van Grondelle and E. Boeker, "Limits on Natural Photosynthesis," *The Journal of Physical Chemistry B*, 2017. <https://pmc.ncbi.nlm.nih.gov/articles/PMC5647561/>

[^kalloniatis]: M. Kalloniatis and C. Luu, "Color Perception," in *Webvision: The Organization of the Retina and Visual System*. <https://www.webvision.pitt.edu/book/part-viii-psychophysics-of-vision/color-perception/>

[^clark]: J. Clark, "What Causes Molecules to Absorb UV and Visible Light," Chemistry LibreTexts. <https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Electronic_Spectroscopy/Electronic_Spectroscopy_Basics/What_Causes_Molecules_to_Absorb_UV_and_Visible_Light>

[^gorfer]: L. M. Gorfer et al., "Chlorophyll breakdown during fruit ripening: Qualitative analysis of phyllobilins in the peel of apples (*Malus domestica* Borkh.) cv. 'Gala' during different shelf life stages," *Food Research International*, 2022. <https://doi.org/10.1016/j.foodres.2022.112061>

[^umd]: A. Capino and M. Farcuh, "Ethylene and the Regulation of Fruit Ripening," University of Maryland Extension. <https://extension.umd.edu/resource/ethylene-and-regulation-fruit-ripening>

[^honda]: C. Honda and S. Moriya, "Anthocyanin Biosynthesis in Apple Fruit," *The Horticulture Journal*, vol. 87, no. 3, pp. 305--314, 2018. <https://doi.org/10.2503/hortj.OKD-R01>

[^merzlyak]: M. N. Merzlyak, A. E. Solovchenko, and A. A. Gitelson, "Reflectance spectral features and non-destructive estimation of chlorophyll, carotenoid and anthocyanin content in apple fruit," *Postharvest Biology and Technology*, vol. 27, no. 2, pp. 197--211, 2003. <https://doi.org/10.1016/S0925-5214(02)00066-2>

[^espley]: R. V. Espley et al., "Red colouration in apple fruit is due to the activity of the MYB transcription factor, MdMYB10," *The Plant Journal*, vol. 49, no. 3, pp. 414--427, 2007. <https://doi.org/10.1111/j.1365-313X.2006.02964.x>

[^chen]: W. Chen et al., "Differential Regulation of Anthocyanin Synthesis in Apple Peel under Different Sunlight Intensities," *International Journal of Molecular Sciences*, vol. 20, no. 23, 6060, 2019. <https://doi.org/10.3390/ijms20236060>

[^linwang]: K. Lin-Wang et al., "High temperature reduces apple fruit colour via modulation of the anthocyanin regulatory complex," *Plant, Cell & Environment*, vol. 34, no. 7, pp. 1176--1190, 2011. <https://doi.org/10.1111/j.1365-3040.2011.02316.x>

[^umaine]: University of Maine Cooperative Extension, "The Role of Ethylene in Fruit Ripening." <https://extension.umaine.edu/fruit/harvest-and-storage-of-tree-fruits/the-role-of-ethylene-in-fruit-ripening/>

[^murata]: M. Murata, "Food chemistry and biochemistry of enzymatic browning," *Food Science and Technology Research*, vol. 28, no. 1, pp. 1--12, 2022. <https://doi.org/10.3136/fstr.FSTR-D-21-00130>

[^arnold]: M. Arnold and A. Gramza-Michałowska, "Enzymatic browning in apple products and its inhibition treatments: A comprehensive review," *Comprehensive Reviews in Food Science and Food Safety*, vol. 21, no. 6, pp. 5038--5076, 2022. <https://doi.org/10.1111/1541-4337.13059>

[^usda]: USDA APHIS, "Extended Determination of Nonregulated Status for Okanagan Specialty Fruits Non-Browning Arctic® Apple PG451." <https://www.aphis.usda.gov/sites/default/files/20-213-01ext_det-pprsa.pdf>

[^janisiewicz]: W. Janisiewicz and A. R. Biggs, "Blue Mold on Apple," Extension Foundation. <https://apples.extension.org/blue-mold-on-apple/>

[^nist]: NIST, "Handbook of Basic Atomic Spectroscopic Data: Strong Lines of Sodium." <https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm>

[^flagstaff]: Flagstaff Dark Skies Coalition, "Low Pressure Sodium Lighting." <https://flagstaffdarkskies.org/low-pressure-sodium-lighting/>
