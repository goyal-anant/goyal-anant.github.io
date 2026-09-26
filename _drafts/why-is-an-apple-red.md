---
title: "Why is an apple red?"
subtitle: "And what happens when you take the red away?"
---
A few questions have been bothering me for a while:

1. How does anything take colour?
2. An apple which is not fully grown looks green, and as time passes its colour changes. How?
3. When an apple decays it turns dark. Is that because the cells are being destroyed and there are fewer cells left to reflect light?
4. If an apple is pure red in sunlight, how will it look under a light which has no trace of red in it, say a monochromatic yellow source?

I also had my own guess for the third one, which I will come back to, because it turned out to be wrong in an interesting way.

I work with electromagnetic waves every day, mostly somewhere between a few MHz and a few GHz. Light is the same thing, just at a much, much higher frequency. Red light with a wavelength of $$\lambda = 600$$ nm oscillates at

$$
f = \frac{c}{\lambda} = \frac{3 \times 10^{8}\ \text{m/s}}{600 \times 10^{-9}\ \text{m}} = 5 \times 10^{14}\ \text{Hz},
$$

i.e. 500 THz. So, this topic is not too far from home for me, and in a separate section I will look at it the way I look at my own antennas and coils.

## How does anything take colour?

Sunlight contains all the wavelengths our eyes can see, typically from 380 to 700 nm[^nasa]. When this light hits an object, the molecules in it absorb some wavelengths and send the rest back (or let them through). Whatever comes back and enters our eye is what we call the colour of the object.

A leaf is the classic example. Chlorophyll absorbs mainly in the blue (400 to 500 nm) and the red (650 to 680 nm), and only a little in the green, around 530 nm. So green light is scattered back out of the leaf, and the leaf looks green[^vangrondelle]. You can see this directly in the measured spectra below: both chlorophylls have two humps, one in the blue and one in the red, and a big valley in the middle, which is exactly the green that comes back to us.

{% include why-is-an-apple-red/pigments.svg %}

*Figure 1. Measured absorption of chlorophyll a, chlorophyll b and beta-carotene, each scaled to its own peak. These are measured in a solvent, not inside a leaf. Data: PhotochemCAD[^pcad], via OMLC.*

There is a second half to this story, which sits in our eyes. We have three types of cone cells whose sensitivities peak at about 440 nm (S-cones), 545 nm (M-cones), and 565 nm (L-cones)[^kalloniatis]. The brain doesn't receive a full spectrum; it receives three numbers, i.e. how strongly each type of cone fired, and it builds the sensation of colour out of them. Keep this in mind, it will come back to bite us in the last section.

{% include why-is-an-apple-red/cones.svg %}

*Figure 2. How sensitive each of the three cone types in our eye is, scaled to a peak of 1. Data: Stockman and Sharpe[^stockman], from the CVRL database. Ignore the dashed line for now.*

> **Going a bit deeper: why does a molecule absorb only some colours?**
>
> Light gets absorbed when its energy exactly matches the energy an electron in the molecule needs to jump to a higher level. Most small molecules need so much energy that they only absorb ultraviolet, which is why they look colourless. But in molecules with long chains of alternating single and double bonds (called *conjugated* systems), the electrons are spread over the whole chain. The more spread out (delocalised) they are, the smaller the energy gap, and the longer the wavelength they absorb[^clark]. Beta-carotene, the pigment in carrots, has 11 conjugated double bonds, so its absorption reaches all the way into the blue[^clark]; in Figure 1 it absorbs from about 400 to 500 nm and nothing beyond, which is why carrots look orange. Chlorophyll and the red pigments of apples both have such conjugated structures, and that is exactly why they absorb in the visible range and not in the UV.

## The electromagnetic view

Everything above is chemistry language: electrons, bonds, energy levels. But light is an electromagnetic wave, and I can't help asking what my own field says about all this. It turns out it says quite a lot.

First, the energy. A photon of frequency $$\nu$$ carries energy $$E = h\nu = hc/\lambda$$, where $$h = 6.626\,070\,15 \times 10^{-34}$$ J/Hz is the Planck constant[^nist_h]. For green light at 550 nm,

$$
E = \frac{hc}{\lambda} = \frac{(6.626 \times 10^{-34}\ \text{J s})(3 \times 10^{8}\ \text{m/s})}{550 \times 10^{-9}\ \text{m}} \approx 3.6 \times 10^{-19}\ \text{J} \approx 2.25\ \text{eV}.
$$

The whole visible range, 380 to 700 nm, is roughly 3.3 eV down to 1.8 eV. So a molecule is coloured only if it has an electron jump which costs somewhere between 1.8 and 3.3 eV, and the conjugated chains in the box above are exactly how nature gets the gap into that window.

Second, and this is the part I like the most: *a pigment molecule behaves like a tiny antenna*. The simplest classical model of a material, the Lorentz oscillator model, treats each bound electron as a mass on a spring[^colton]. The spring is the pull of the nucleus, which gives the electron a natural (resonance) frequency $$\omega_0$$. The oscillating electric field of the light wave pushes the electron back and forth, and some friction-like damping $$\gamma$$ takes energy out of the motion. Newton's second law for the electron is then[^colton]

$$
\frac{d^2x}{dt^2} + \gamma \frac{dx}{dt} + \omega_0^2 x = \frac{qE_0}{m} \cos(\omega t),
$$

which is the same equation as a driven, damped spring, or a driven RLC circuit. When you solve it and add up the dipoles of $$N$$ such electrons per unit volume, you get the permittivity of the material[^colton]:

$$
\varepsilon(\omega) = 1 + \frac{N q^2}{\varepsilon_0 m} \, \frac{1}{\omega_0^2 - \omega^2 - i\gamma\omega}.
$$

The $$-i\gamma\omega$$ in the denominator makes $$\varepsilon$$ a complex number, and so the refractive index $$\tilde{n} = \sqrt{\varepsilon}$$ becomes complex too. Its real part decides how much light bends (Snell's law), and its imaginary part decides how much light is absorbed[^colton]. Figure 3 shows what the two parts look like around the resonance.

{% include why-is-an-apple-red/lorentz.svg %}

*Figure 3. One Lorentz oscillator with $$Q = 8$$, plotted from the equation above, so this is the model and not a measurement. Absorption (red) peaks at resonance; the real part (blue, dashed) flips sign across it.*

Now look at it with an engineer's eyes. In wireless power transfer, the receiver coil is tuned so that it resonates at the transmitter's frequency; at resonance it pulls the most power out of the field, and a little away from resonance it pulls much less. How wide that window is depends on the losses, i.e. on the quality factor $$Q = \omega_0 / \gamma$$. A pigment is the same thing at 500 THz: chlorophyll has resonances in the blue and in the red, and those are the frequencies it takes out of sunlight (Figure 1). The broad humps in Figure 1 are, in this language, low-$$Q$$ resonances. So when I say an apple "absorbs green", what I really mean is that the apple's skin is full of tiny receivers tuned to green.

The same model also tells us what happens at a boundary, which will be useful for the decay section. For light hitting the boundary between two materials straight on, the fraction of power reflected is given by the Fresnel equation[^colton]

$$
R = \left| \frac{\tilde{n}_1 - \tilde{n}_2}{\tilde{n}_1 + \tilde{n}_2} \right|^2 .
$$

No difference in refractive index, no reflection. Remember this one.

## Why does a green apple turn red?

An unripe apple is green for the same reason a leaf is green: its skin is full of chlorophyll. As the apple ripens, two things happen in the skin at the same time.

First, the green goes away. Chlorophyll is broken down during ripening into colourless compounds called phyllobilins; this has been tracked in the peel of 'Gala' apples during their shelf life[^gorfer]. Extension guides for growers describe the same thing from the outside: as the fruit ripens, "the green background color fades"[^umd].

Second, the red is built. At the same time, the skin cells start producing anthocyanins, the same family of pigments that colour red cabbage and blueberries. In apple skin, one anthocyanin, cyanidin 3-galactoside, accounts for more than 85% of the total[^honda]. Measurements of light reflected by apple peel show that anthocyanins absorb near 550 nm[^merzlyak], i.e. in the green. In the antenna language of the previous section, the apple swaps its receivers: the ones tuned to blue and red are taken down, and new ones tuned to green are put up. Take the green out of sunlight and what comes back is mostly red.

The figure below is a sketch of what this looks like as a spectrum.

{% include why-is-an-apple-red/apple-skin.svg %}

*Figure 4. Schematic, not measured data. I couldn't find an openly licensed measured spectrum of apple skin, so I drew the shapes from the absorption bands in Merzlyak et al.[^merzlyak] Ignore the dashed line for now.*

What decides *when* the apple starts making red? It turns out there is a master switch: a gene called MdMYB10. It codes for a protein which turns on all the genes needed to make anthocyanin. Its activity rises exactly when the colour forms, and apple plants engineered to make more of it become highly pigmented[^espley]. The two most interesting things I learned about this switch are about the weather:

1. It needs sunlight. No anthocyanin is made in darkness[^honda], and more sunlight gives more pigment in the peel, up to a point[^chen]. This is probably why the side of an apple facing the sun is usually redder than the side facing the tree.
2. It likes cold nights. Heating apples on the tree dramatically reduced both the pigment and the activity of MYB10, while a *single* night of low temperatures was enough to give a large boost to MYB10[^linwang]. That is why apples grown in hot climates tend to colour poorly. You can see this in Himachal. The old Delicious apples of the lower hills colour poorly, and the government's own extension centres now call poor colouring at lower elevation a problem made worse by climate change; in the mid hills around Rohru, growers have been replacing them with more strongly coloured strains like 'Red Chief' and 'Scarlet Spur'[^icar]. The orchards themselves are also climbing: apples were grown between 1200 and 1500 m in the 1980s, between 1500 and 2500 m in the 2000s, and by 2014 above 3500 m, in upper Kinnaur and Lahaul-Spiti, as the valleys below got warmer[^sahu].

And if the apple is yellow, like Golden Delicious, the chlorophyll still leaves but very little anthocyanin is made, so the yellow carotenoids which were hiding under the green all along get to show up (apple skin colour depends on chlorophyll and carotenoids too, not only anthocyanin[^honda]).

One more thing, which is important for the next section: an apple doesn't stop ripening once it is picked. Apple is a *climacteric* fruit. Such fruits can ripen after harvest, and during ripening they breathe faster and release a burst of ethylene, a gas which acts as a ripening hormone and triggers even more of itself[^umd]. Some varieties produce so much of it that they soften and age quickly in storage[^umaine]. So the apple in your fruit basket is very much alive.

## My hypothesis about decay, and why it is wrong

This was my guess:

> If there are chemical combinations going on continuously and the cells are being destroyed when the fruit is picked from the tree, then there will be fewer cells to reflect the light, so blackening of the fruit, which we call decay, takes place, i.e. more absorption and less reflection.

It sounds reasonable. The last part is even right: a brown apple *does* absorb more and reflect less. But the reason is not that cells go missing. Here is why.

First, the time scale doesn't fit. Cut an apple and leave it on the table: the surface turns brown in minutes. No significant number of cells disappears in a few minutes, so something must be getting added.

And what gets added is a new pigment. Inside an apple cell, the enzyme polyphenol oxidase (PPO) sits in small compartments called plastids, while its raw material, the phenolic compounds, is stored in the vacuole. In a healthy cell the two never meet, so there is no browning. When the compartments break, by cutting, bruising, insects, or just by ageing, the enzyme meets the phenolics in the presence of oxygen and turns them into quinones, which then chemically link up into brown polymers[^murata]. The same mechanism is behind the browning of fresh-cut apple, puree, and juice, which the food industry spends a lot of effort to prevent[^arnold]. In the language of the electromagnetism, the broken cell builds a brand new set of receivers.

{% include why-is-an-apple-red/browning.svg %}

*Figure 5. Enzymatic browning, following Murata[^murata].*

The best evidence is an apple which doesn't brown. The Arctic apple is a genetically engineered apple in which four PPO genes are suppressed, and the result is a non-browning apple. If browning were about cells disappearing and reflecting less, silencing one enzyme wouldn't have stopped it.

### Where my guess was closer than I thought

There is one place where "less reflection" happens without any new pigment, and it is pure electromagnetics.

Think about why the flesh of an apple is white at all. It has almost no pigment; the cortex of an apple is usually colourless[^espley]. A glass of water is also colourless, but it is transparent, not white. The difference is structure. Apple flesh is not a solid block: up to 30% of the volume of an apple can be air, sitting in the spaces between the cells, depending on the cultivar[^herremans]. In 'Jonagold' apples, the air fraction of the flesh grew from 10.6% early in the season to 26.4% at harvest[^herremans]. So a beam of light going into the flesh crosses cell wall, air, cell wall, air, again and again, and at every crossing the Fresnel equation from the previous section sends a little bit back.

How much? The refractive index of plant cell walls is about 1.425[^gausman], water is about 1.33[^halequerry], and air is 1.0. Putting these into the Fresnel equation:

$$
R_{\text{wall|air}} = \left(\frac{1.425 - 1}{1.425 + 1}\right)^2 \approx 3.1\%,
$$

$$
R_{\text{wall|water}} = \left(\frac{1.425 - 1.33}{1.425 + 1.33}\right)^2 \approx 0.12\%.
$$

{% include why-is-an-apple-red/fresnel.svg %}

*Figure 6. Light reflected at one boundary, from the Fresnel equation, taking refractive index 1.425 for cell walls[^gausman] and 1.33 for water[^halequerry].*

One boundary reflects only 3%, but light inside the flesh meets a very large number of them, and bit by bit most of it gets sent back out, so the flesh looks white. Now replace the air with water: each boundary reflects about 25 times less, the light goes deep and gets absorbed or passes through, and the tissue looks darker and glassy. This is not just a calculation. When liquid is pushed into the air spaces of a leaf, the leaf reflects less light over the whole 500 to 2500 nm range, precisely because the cell wall to air boundaries are removed[^gausman][^woolley]. And apples do it to themselves. In a disorder called *watercore*, the air spaces in the flesh fill up with a sorbitol-rich liquid, and the affected flesh looks translucent and glassy[^umdwater].

![An apple cut in half with glassy, see-through flesh](/assets/images/why-is-an-apple-red/watercore.jpg)

*Figure 7. An apple with watercore: the glassy parts have liquid instead of air between the cells. Photo: [Red58bill](https://commons.wikimedia.org/wiki/File:Watercore.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0), Wikimedia Commons.*

So there *is* a way for an apple to reflect less without any new pigment: take away the air-filled boundaries between its cells. My guess said "fewer cells"; the physics says "fewer cell-to-air boundaries". That is not what makes a cut apple brown, but it is a real way to make apple flesh darker, and I didn't expect my wrong guess to land so close to it.

And real rot is someone else's work, lol! The soft, watery, spreading brown patch on a stored apple is mostly fungi. The most important one is *Penicillium expansum*, which causes blue mould; it enters through fresh wounds like stem punctures, bruises, and even scratches from pickers' fingernails, and makes lesions which are soft, watery, and light brown, later covered with bluish-green spores[^janisiewicz]. So decay is the apple being eaten by fungi, and browning is the apple's own chemistry; in neither case are fewer cells the reason.

![Blue-green mould spores on rotting apple flesh](/assets/images/why-is-an-apple-red/blue-mould.jpg)

*Figure 8. Blue mould on an apple; the little stalks carry the spores. Photo: [ImagePerson](https://commons.wikimedia.org/wiki/File:Blue_Mold_Penicillium_expansum_aspore_masses_on_apple_4461.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), Wikimedia Commons.*

## A red apple under yellow light

Now the fun one. Suppose the apple is *pure* red: it reflects only red light and absorbs everything else. Put it under a light source which emits only yellow. There is nothing in the incoming light which the apple can reflect, so nothing comes back, and the apple looks black.

Such a light source exists and was, for a long time, hanging over our streets: the low-pressure sodium lamp. Its light is almost entirely two lines very close to each other, at 588.995 nm and 589.592 nm[^nist], the famous sodium D lines. Under this lamp there is "essentially no color rendition"[^flagstaff]: every object looks like a brighter or darker shade of the same yellow-orange. (Astronomers love these lamps for exactly this reason: all the light pollution sits at one wavelength, which is easy to filter out[^flagstaff].)

![A street at night under orange sodium lamps, the grass looks brown](/assets/images/why-is-an-apple-red/sodium-street.jpg)

*Figure 9. A street in Mainz, Germany, under low-pressure sodium lamps. The grass has no green left; only things with their own light, like the billboards, show colour. (The camera makes it look more yellow than it is to the eye.) Photo: [ManuelB701](https://commons.wikimedia.org/wiki/File:Mainz-Oberstadt_-_Geschwister-Scholl-Stra%C3%9Fe,_Stra%C3%9Fenbahn_Hechtsheim_unter_Natriumdampflicht.jpg), CC0, Wikimedia Commons.*

A real apple is not *pure* red, so it is not perfectly black either. Look at the dashed line in Figure 4: at 589 nm the red apple sits right at the edge of its anthocyanin absorption, so it reflects only a little. Under a sodium lamp it would look like a dark, dull, brownish version of the lamp's colour. A green apple reflects more at 589 nm, so it would likely look *brighter* than the red one. You would no longer be able to tell a red apple from a green apple by colour at all; only by how bright or dark it is.

Our eyes explain why. Look at the dashed line in Figure 2: at 589 nm the S-cones hardly respond at all, and the M- and L-cones respond in a fixed ratio. Whatever the object, the brain gets the same pair of numbers, just scaled up or down with brightness. One ratio means one colour, and all that is left is light and dark.

### Don't test this with your phone

Here is the trap. If you open a picture of plain yellow on your phone and hold an apple in front of it, the apple will still look reddish. Why? Because your screen has no yellow light. Each pixel has only red, green, and blue sub-pixels, and "yellow" on a screen is red plus green light at the same time. Our eyes can't tell the difference: all that matters is how strongly the M- and L-cones fire, and a suitable mix of red and green makes them fire just like pure 589 nm light does. This is the whole reason almost any colour can be matched by mixing three primaries[^kalloniatis]. Two lights with completely different spectra look the same to us, but the apple is not fooled: it reflects the red part of your "yellow" screen and looks red.

So to do this experiment properly, you need pure monochromatic light:

1. A sodium lamp, if you can still find one.
2. A sodium flame. Sprinkle a pinch of table salt into a gas flame (a gas stove works) in a dark room. The bright yellow you see is the same sodium D-line emission[^nist]. It is not very bright, so keep the apple close, and be careful with the fire.
3. A narrow-band filter around 589 nm in front of a white torch, if you happen to have one in a lab.

Put a red apple, a green apple, and something white next to each other and watch the colours drain out. You may send me photos at anantnug[at]gmail[dot]com if you try this :)

## Try it yourself

If you don't have a sodium lamp lying around (I don't either), here is a small game. For every question, the page actually computes the colour: it multiplies the spectrum of the light with how much the object reflects at each wavelength, feeds that into the standard colour-matching functions of the human eye[^cie1931], and converts the result into a colour your screen can show. Sunlight is the CIE standard daylight spectrum D65[^d65], and the leaf is a real apple leaf, measured with a spectroradiometer[^braun]. Guess first, then read why.

{% include colour-game.html %}

*About the game: the two apples use the sketched curves of Figure 4, not measured data. The phone's "yellow" is two narrow bands at 530 and 620 nm, mixed so the cones see it like 589 nm light; real screens differ a little. White paper reflects 90% everywhere. And no screen can show the real sodium yellow, so you see the closest it can do.*

## So, how does anything take colour?

An object's colour is the part of the light which it doesn't absorb, as decoded by three types of cells in our eyes. The absorbing is done by molecules which behave like tiny tuned receivers, and the reflecting is helped along by every boundary where the refractive index jumps. An apple is green when chlorophyll is taking out the red and blue, red when anthocyanin is taking out the green, brown when broken cells let an enzyme build a new brown pigment, and glassy when its air pockets fill with liquid. Change the light source and the colour changes with it.

Until next time.

---

## References

[^nasa]: NASA Science, "Visible Light". [link](https://science.nasa.gov/ems/09_visiblelight/)

[^vangrondelle]: van Grondelle & Boeker, "Limits on Natural Photosynthesis", J. Phys. Chem. B, 2017. [link](https://pmc.ncbi.nlm.nih.gov/articles/PMC5647561/)

[^pcad]: Dixon, Taniguchi & Lindsey, "PhotochemCAD 2", Photochemistry and Photobiology, 2005. [doi](https://doi.org/10.1111/j.1751-1097.2005.tb01544.x). Data files by S. Prahl, OMLC: [link](https://omlc.org/spectra/PhotochemCAD/)

[^kalloniatis]: Kalloniatis & Luu, "Color Perception", Webvision. [link](https://www.webvision.pitt.edu/book/part-viii-psychophysics-of-vision/color-perception/)

[^stockman]: Stockman & Sharpe, "The spectral sensitivities of the middle- and long-wavelength-sensitive cones…", Vision Research, 2000. [doi](https://doi.org/10.1016/S0042-6989(00)00021-3). Data from CVRL: [link](http://www.cvrl.org/cones.htm)

[^clark]: J. Clark, "What Causes Molecules to Absorb UV and Visible Light", Chemistry LibreTexts. [link](https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Electronic_Spectroscopy/Electronic_Spectroscopy_Basics/What_Causes_Molecules_to_Absorb_UV_and_Visible_Light)

[^nist_h]: NIST, CODATA value of the Planck constant. [link](https://physics.nist.gov/cgi-bin/cuu/Value?h)

[^colton]: J. Colton, "Lorentz Oscillator Model of the Dielectric Function", BYU Physics 581 notes, 2020. [pdf](https://physics.byu.edu/faculty/colton/docs/phy581-resources/lorentz-oscillator-model-of-the-dielectric-function.pdf)

[^gorfer]: Gorfer et al., "Chlorophyll breakdown during fruit ripening… 'Gala'…", Food Research International, 2022. [doi](https://doi.org/10.1016/j.foodres.2022.112061)

[^umd]: Capino & Farcuh, "Ethylene and the Regulation of Fruit Ripening", University of Maryland Extension. [link](https://extension.umd.edu/resource/ethylene-and-regulation-fruit-ripening)

[^honda]: Honda & Moriya, "Anthocyanin Biosynthesis in Apple Fruit", Horticulture Journal, 2018. [doi](https://doi.org/10.2503/hortj.OKD-R01)

[^merzlyak]: Merzlyak, Solovchenko & Gitelson, "Reflectance spectral features and non-destructive estimation of chlorophyll, carotenoid and anthocyanin content in apple fruit", Postharvest Biology and Technology, 2003. [doi](https://doi.org/10.1016/S0925-5214(02)00066-2)

[^espley]: Espley et al., "Red colouration in apple fruit is due to the activity of the MYB transcription factor, MdMYB10", The Plant Journal, 2007. [doi](https://doi.org/10.1111/j.1365-313X.2006.02964.x)

[^chen]: Chen et al., "Differential Regulation of Anthocyanin Synthesis in Apple Peel under Different Sunlight Intensities", IJMS, 2019. [doi](https://doi.org/10.3390/ijms20236060)

[^linwang]: Lin-Wang et al., "High temperature reduces apple fruit colour via modulation of the anthocyanin regulatory complex", Plant, Cell & Environment, 2011. [doi](https://doi.org/10.1111/j.1365-3040.2011.02316.x)

[^icar]: ICAR, "Coloured Strains of Apple for Enhancing Income in Mid-Hills under Climate Change Scenario" (KVK Rohru). [link](https://www.icar.org.in/en/node/4744)

[^sahu]: Sahu et al., "Why apple orchards are shifting to the higher altitudes of the Himalayas?", PLoS ONE, 2020. [doi](https://doi.org/10.1371/journal.pone.0235041)

[^umaine]: University of Maine Extension, "The Role of Ethylene in Fruit Ripening". [link](https://extension.umaine.edu/fruit/harvest-and-storage-of-tree-fruits/the-role-of-ethylene-in-fruit-ripening/)

[^murata]: M. Murata, "Food chemistry and biochemistry of enzymatic browning", Food Science and Technology Research, 2022. [doi](https://doi.org/10.3136/fstr.FSTR-D-21-00130)

[^arnold]: Arnold & Gramza-Michałowska, "Enzymatic browning in apple products and its inhibition treatments: A comprehensive review", CRFSFS, 2022. [doi](https://doi.org/10.1111/1541-4337.13059)

[^usda]: USDA APHIS, extended determination of nonregulated status for the Arctic apple PG451. [pdf](https://www.aphis.usda.gov/sites/default/files/20-213-01ext_det-pprsa.pdf)

[^herremans]: Herremans et al., "Spatial development of transport structures in apple fruit", Frontiers in Plant Science, 2015. [doi](https://doi.org/10.3389/fpls.2015.00679)

[^gausman]: Gausman, Allen & Escobar, "Refractive Index of Plant Cell Walls", Applied Optics, 1974. [doi](https://doi.org/10.1364/AO.13.000109)

[^halequerry]: Hale & Querry, "Optical Constants of Water in the 200-nm to 200-μm Wavelength Region", Applied Optics, 1973. [doi](https://doi.org/10.1364/AO.12.000555)

[^woolley]: J. T. Woolley, "Reflectance and Transmittance of Light by Leaves", Plant Physiology, 1971. [doi](https://doi.org/10.1104/pp.47.5.656)

[^umdwater]: M. Farcuh, "Water core in apples", University of Maryland Extension. [link](https://extension.umd.edu/resource/water-core-apples-what-it-what-causes-it-and-how-can-it-be-controlled)

[^cie1931]: CIE 1931 colour-matching functions, 2 degree observer. [doi](https://doi.org/10.25039/CIE.DS.xvudnb9b). Values taken from CVRL: [link](http://www.cvrl.org/)

[^d65]: CIE standard illuminant D65. [doi](https://doi.org/10.25039/CIE.DS.hjfjmt59)

[^braun]: Braun et al., "A Multi-Temporal Field Spectroscopy Dataset of Apple Leaf Reflectance for Tree Vitality Monitoring", Zenodo, 2026, CC BY 4.0. [doi](https://doi.org/10.5281/zenodo.22143346). The game uses the mean of the 30 spectra measured on 16 July 2025.

[^janisiewicz]: Janisiewicz & Biggs, "Blue Mold on Apple", Extension Foundation. [link](https://apples.extension.org/blue-mold-on-apple/)

[^nist]: NIST, "Strong Lines of Sodium", Handbook of Basic Atomic Spectroscopic Data. [link](https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm)

[^flagstaff]: Flagstaff Dark Skies Coalition, "Low Pressure Sodium Lighting". [link](https://flagstaffdarkskies.org/low-pressure-sodium-lighting/)
