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

A leaf is the classic example. Chlorophyll absorbs mainly in the blue (400--500 nm) and the red (650--680 nm), and only a little in the green, around 530 nm. So green light is scattered back out of the leaf, and the leaf looks green[^vangrondelle]. You can see this directly in the measured spectra below: both chlorophylls have two humps, one in the blue and one in the red, and a big valley in the middle, which is exactly the green that comes back to us.

<figure>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="figpigt figpigd" style="width:100%;height:auto;max-width:640px;font-family:inherit">
  <title id="figpigt">Measured absorption spectra of chlorophyll a, chlorophyll b and beta-carotene</title>
  <desc id="figpigd">Chlorophyll a and b absorb strongly in the blue (around 430 to 460 nm) and in the red (around 640 to 660 nm) and hardly at all in the green. Beta-carotene absorbs only in the blue, between about 400 and 500 nm.</desc>
  <defs>
    <linearGradient id="figpigg" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#6a00c8"/><stop offset="22%" stop-color="#0050ff"/>
      <stop offset="34%" stop-color="#00b8ff"/><stop offset="47%" stop-color="#00c800"/>
      <stop offset="59%" stop-color="#d8e800"/><stop offset="66%" stop-color="#ffb000"/>
      <stop offset="75%" stop-color="#ff4000"/><stop offset="100%" stop-color="#a00000"/>
    </linearGradient>
  </defs>
  <rect x="60" y="256" width="540" height="10" fill="url(#figpigg)"/>
  <g fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"><line x1="60" y1="250" x2="600" y2="250"/><line x1="60" y1="30" x2="60" y2="250"/></g>
  <g fill="currentColor" font-size="13" text-anchor="middle">
    <text x="94" y="284">400</text>
    <text x="262" y="284">500</text>
    <text x="431" y="284">600</text>
    <text x="600" y="284">700</text>
    <text x="330" y="306">wavelength (nm)</text>
    <text x="22" y="140" transform="rotate(-90 22 140)">absorption (normalised)</text>
  </g>
  <g font-size="13" font-weight="600">
    <line x1="452" y1="44" x2="474" y2="44" stroke="#2e8b57" stroke-width="3"/><text x="480" y="48" fill="#2e8b57">chlorophyll a</text>
    <line x1="452" y1="62" x2="474" y2="62" stroke="#8bc34a" stroke-width="3"/><text x="480" y="66" fill="#8bc34a">chlorophyll b</text>
    <line x1="452" y1="80" x2="474" y2="80" stroke="#e67e22" stroke-width="3"/><text x="480" y="84" fill="#e67e22">beta-carotene</text>
  </g>
  <polyline fill="none" stroke="#2e8b57" stroke-width="2.5" stroke-linejoin="round" points="60.2,164.8 62.1,163.5 64.0,164.5 65.9,164.3 67.8,165.3 69.7,164.8 71.6,165.3 73.5,164.6 75.4,165.0 77.3,163.7 79.2,162.0 81.1,158.8 83.0,155.5 84.9,149.9 86.8,144.8 88.7,139.2 90.6,134.0 92.5,128.3 94.4,124.8 96.3,121.1 98.2,117.7 100.1,114.9 102.0,113.4 103.9,111.4 105.8,110.7 107.7,109.7 109.6,110.4 111.5,110.2 113.4,110.8 115.3,110.6 117.2,111.1 119.1,109.8 121.0,108.1 122.9,103.7 124.7,97.7 126.7,91.2 128.5,80.9 130.5,70.2 132.3,60.2 134.2,49.5 136.1,40.6 138.0,34.5 139.9,30.7 141.8,31.4 143.7,34.6 145.6,44.2 147.5,58.1 149.4,79.9 151.3,104.1 153.2,130.4 155.1,153.9 157.0,174.9 158.9,191.8 160.8,204.7 162.7,214.6 164.6,222.3 166.5,228.9 168.4,233.3 170.3,237.1 172.2,239.6 174.1,242.0 176.0,242.8 177.9,244.0 179.8,245.2 181.7,245.7 183.6,245.9 185.5,246.1 187.4,246.4 189.3,247.1 191.2,247.0 193.1,247.5 195.0,247.5 196.9,248.1 198.8,247.6 200.7,247.9 202.6,248.0 204.5,247.9 206.4,248.3 208.3,248.1 210.2,248.0 212.1,248.2 214.0,248.2 215.9,247.8 217.8,248.0 219.7,248.0 221.6,247.9 223.5,247.9 225.4,248.1 227.3,247.9 229.2,247.7 231.1,247.6 233.0,247.3 234.9,247.2 236.8,246.9 238.7,247.4 240.6,246.8 242.5,246.8 244.4,246.5 246.2,246.7 248.2,246.6 250.0,246.6 252.0,246.6 253.8,246.4 255.8,246.8 257.6,246.3 259.5,246.2 261.4,246.2 263.3,246.3 265.2,246.4 267.1,246.5 269.0,246.5 270.9,246.2 272.8,246.1 274.7,246.5 276.6,246.7 278.5,246.1 280.4,245.9 282.3,246.1 284.2,245.8 286.1,245.3 288.0,245.2 289.9,245.4 291.8,244.8 293.7,244.6 295.6,244.0 297.5,244.2 299.4,243.8 301.3,243.1 303.2,243.6 305.1,242.7 307.0,242.8 308.9,242.7 310.8,242.3 312.7,242.7 314.6,242.6 316.5,242.7 318.4,242.9 320.3,242.5 322.2,243.1 324.1,242.9 326.0,243.4 327.9,243.6 329.8,243.7 331.7,243.8 333.6,244.1 335.5,244.2 337.4,244.5 339.3,244.5 341.2,244.6 343.1,244.7 345.0,244.6 346.9,244.5 348.8,244.8 350.7,244.2 352.6,243.7 354.5,243.5 356.4,242.9 358.3,242.8 360.2,242.2 362.1,241.7 364.0,241.2 365.9,240.5 367.7,240.1 369.7,239.1 371.5,238.9 373.5,238.4 375.3,237.9 377.2,237.4 379.1,237.3 381.0,236.6 382.9,236.1 384.8,236.0 386.7,235.9 388.6,235.6 390.5,235.4 392.4,235.9 394.3,236.2 396.2,236.5 398.1,237.5 400.0,237.6 401.9,238.1 403.8,238.5 405.7,239.5 407.6,239.4 409.5,239.8 411.4,240.4 413.3,240.0 415.2,239.9 417.1,239.4 419.0,239.1 420.9,238.1 422.8,236.9 424.7,236.1 426.6,235.0 428.5,233.5 430.4,232.5 432.3,231.0 434.2,230.2 436.1,229.0 438.0,228.2 439.9,227.1 441.8,226.3 443.7,225.7 445.6,225.0 447.5,224.5 449.4,224.0 451.3,224.0 453.2,224.0 455.1,223.4 457.0,223.8 458.9,224.0 460.8,224.4 462.7,225.3 464.6,225.7 466.5,225.9 468.4,227.2 470.3,228.0 472.2,229.3 474.1,230.2 476.0,231.5 477.9,232.1 479.8,232.7 481.7,232.9 483.6,233.1 485.5,233.6 487.4,233.8 489.2,232.9 491.2,232.3 493.0,231.8 495.0,230.5 496.8,228.8 498.8,226.1 500.6,224.1 502.5,221.1 504.4,217.2 506.3,212.1 508.2,206.4 510.1,199.2 512.0,190.6 513.9,183.3 515.8,175.1 517.7,163.4 519.6,150.7 521.5,136.8 523.4,123.1 525.3,109.9 527.2,97.3 529.1,89.5 531.0,84.5 532.9,82.8 534.8,85.4 536.7,92.6 538.6,103.9 540.5,117.6 542.4,132.9 544.3,148.6 546.2,164.7 548.1,178.7 550.0,191.8 551.9,203.6 553.8,213.9 555.7,223.3 557.6,230.4 559.5,235.2 561.4,238.4 563.3,241.1 565.2,242.5 567.1,243.7 569.0,245.2 570.9,245.6 572.8,246.1 574.7,247.0 576.6,247.5 578.5,247.5 580.4,247.6 582.3,248.2 584.2,248.1 586.1,248.3 588.0,248.5 589.9,248.3 591.8,248.4 593.7,248.4 595.6,249.2 597.5,249.0 599.4,249.5"/>
  <polyline fill="none" stroke="#8bc34a" stroke-width="2.5" stroke-linejoin="round" points="60.0,222.6 61.7,223.4 63.4,224.3 65.1,225.4 66.8,226.6 68.4,227.8 70.1,229.0 71.8,230.0 73.5,230.9 75.2,231.6 76.9,232.1 78.6,232.5 80.2,232.7 81.9,232.7 83.6,232.5 85.3,232.2 87.0,231.8 88.7,231.3 90.4,230.8 92.1,230.3 93.8,229.7 95.4,229.1 97.1,228.6 98.8,228.2 100.5,227.7 102.2,227.2 103.9,226.7 105.6,226.0 107.2,225.2 108.9,224.3 110.6,223.0 112.3,221.6 114.0,219.9 115.7,217.7 117.4,215.2 119.1,212.3 120.8,209.0 122.4,205.3 124.1,201.3 125.8,197.0 127.5,192.5 129.2,188.2 130.9,184.3 132.6,180.9 134.2,177.9 135.9,175.5 137.6,173.7 139.3,172.5 141.0,171.8 142.7,171.6 144.4,171.8 146.1,172.1 147.8,172.5 149.4,173.0 151.1,173.1 152.8,172.6 154.5,171.7 156.2,169.7 157.9,166.6 159.6,162.2 161.2,156.4 162.9,148.8 164.6,140.2 166.3,130.0 168.0,118.5 169.7,105.9 171.4,92.4 173.1,79.3 174.8,66.4 176.4,54.6 178.1,44.2 179.8,36.7 181.5,31.6 183.2,30.0 184.9,31.3 186.6,35.7 188.2,42.6 189.9,52.1 191.6,63.5 193.3,76.0 195.0,88.8 196.7,102.3 198.4,115.9 200.1,129.7 201.8,143.1 203.4,155.1 205.1,166.1 206.8,176.5 208.5,186.9 210.2,195.6 211.9,203.6 213.6,210.8 215.2,217.1 216.9,222.4 218.6,226.7 220.3,230.3 222.0,233.3 223.7,235.7 225.4,237.8 227.1,239.4 228.8,240.7 230.4,241.7 232.1,242.5 233.8,243.1 235.5,243.7 237.2,244.2 238.9,244.6 240.6,244.3 242.2,244.6 243.9,244.8 245.6,244.8 247.3,244.9 249.0,244.9 250.7,244.9 252.4,244.9 254.1,245.0 255.8,245.0 257.4,244.9 259.1,244.8 260.8,244.9 262.5,244.9 264.2,244.9 265.9,244.9 267.6,244.8 269.2,244.9 270.9,244.8 272.6,244.9 274.3,244.9 276.0,244.9 277.7,244.8 279.4,244.8 281.1,244.8 282.8,244.8 284.4,244.8 286.1,244.7 287.8,244.6 289.5,244.6 291.2,244.6 292.9,244.4 294.6,244.4 296.2,244.3 297.9,244.2 299.6,244.0 301.3,244.0 303.0,243.7 304.7,243.6 306.4,243.5 308.1,243.3 309.8,243.1 311.4,242.8 313.1,242.6 314.8,242.4 316.5,242.1 318.2,241.9 319.9,241.6 321.6,241.5 323.2,241.2 324.9,241.1 326.6,241.0 328.3,240.8 330.0,240.6 331.7,240.5 333.4,240.5 335.1,240.4 336.8,240.3 338.4,240.2 340.1,240.2 341.8,240.2 343.5,240.2 345.2,240.1 346.9,240.1 348.6,240.1 350.2,240.2 351.9,240.2 353.6,240.1 355.3,240.0 357.0,240.0 358.7,239.9 360.4,239.8 362.1,239.7 363.8,239.6 365.4,239.4 367.1,239.4 368.8,239.3 370.5,239.2 372.2,239.2 373.9,239.2 375.6,239.2 377.2,239.2 378.9,239.2 380.6,239.2 382.3,239.3 384.0,239.3 385.7,239.3 387.4,239.3 389.1,239.3 390.8,239.3 392.4,239.2 394.1,239.1 395.8,238.8 397.5,238.5 399.2,238.2 400.9,237.9 402.6,237.4 404.2,237.0 405.9,236.6 407.6,236.2 409.3,235.8 411.0,235.5 412.7,235.1 414.4,234.9 416.1,234.7 417.8,234.5 419.4,234.5 421.1,234.4 422.8,234.5 424.5,234.6 426.2,234.8 427.9,235.1 429.6,235.5 431.2,235.9 432.9,236.3 434.6,236.7 436.3,237.1 438.0,237.5 439.7,237.7 441.4,238.0 443.1,238.0 444.8,238.1 446.4,238.1 448.1,238.1 449.8,238.1 451.5,238.2 453.2,238.3 454.9,238.4 456.6,238.5 458.2,238.6 459.9,238.8 461.6,238.9 463.3,238.9 465.0,238.8 466.7,238.6 468.4,238.2 470.1,237.7 471.8,237.0 473.4,236.0 475.1,234.8 476.8,233.3 478.5,231.4 480.2,229.2 481.9,226.7 483.6,223.6 485.2,220.0 486.9,215.8 488.6,210.8 490.3,205.2 492.0,199.2 493.7,192.9 495.4,186.8 497.1,181.2 498.8,176.5 500.4,173.0 502.1,171.2 503.8,171.1 505.5,172.8 507.2,176.5 508.9,181.5 510.6,187.6 512.2,194.2 513.9,201.3 515.6,208.1 517.3,214.7 519.0,220.5 520.7,225.6 522.4,229.8 524.1,234.0 525.8,237.2 527.4,238.0 529.1,240.2 530.8,241.9 532.5,243.0 534.2,243.9 535.9,244.6 537.6,245.2 539.2,245.8 540.9,246.2 542.6,246.6 544.3,246.9 546.0,247.1 547.7,247.4 549.4,247.6 551.1,247.7 552.8,247.9 554.4,247.9 556.1,248.0 557.8,248.1 559.5,248.2 561.2,248.2 562.9,248.3 564.6,248.4 566.2,248.5 567.9,248.6 569.6,248.6 571.3,248.7 573.0,248.8 574.7,248.9 576.4,248.9 578.1,249.0 579.8,249.1 581.4,249.1 583.1,249.1 584.8,249.2 586.5,249.2 588.2,249.3 589.9,249.3 591.6,249.3 593.2,249.3 594.9,249.3 596.6,249.3 598.3,249.4 600.0,249.4"/>
  <polyline fill="none" stroke="#e67e22" stroke-width="2.5" stroke-linejoin="round" points="60.4,199.4 62.1,202.1 63.8,198.2 65.5,197.9 67.2,197.2 68.8,193.2 70.5,191.9 72.2,190.7 73.9,187.6 75.6,185.8 77.3,183.6 79.0,180.3 80.7,179.7 82.3,175.2 84.0,170.0 85.7,169.3 87.4,164.5 89.1,162.5 90.8,159.3 92.5,157.4 94.2,155.0 95.8,152.0 97.5,153.3 99.2,150.8 100.9,147.0 102.6,147.2 104.3,145.4 106.0,142.7 107.7,137.8 109.3,137.1 111.0,134.6 112.7,131.4 114.4,126.5 116.1,123.5 117.8,119.6 119.5,118.5 121.2,113.2 122.8,108.0 124.5,104.7 126.2,100.6 127.9,95.9 129.6,93.3 131.3,90.8 133.0,86.9 134.7,86.4 136.3,83.2 138.0,82.6 139.7,82.6 141.4,81.0 143.1,79.9 144.8,80.7 146.5,78.7 148.2,79.7 149.8,77.4 151.5,76.3 153.2,75.3 154.9,72.2 156.6,70.2 158.3,66.1 160.0,63.2 161.7,59.3 163.3,54.3 165.0,54.1 166.7,46.9 168.4,43.8 170.1,40.9 171.8,36.1 173.5,34.8 175.2,33.0 176.8,33.2 178.5,32.0 180.2,33.1 181.9,32.5 183.6,34.5 185.3,36.4 187.0,38.7 188.7,42.1 190.3,46.4 192.0,51.7 193.7,55.7 195.4,61.0 197.1,63.8 198.8,68.9 200.5,70.4 202.2,74.6 203.8,75.9 205.5,76.3 207.2,80.5 208.9,80.3 210.6,79.1 212.3,78.4 214.0,77.5 215.7,77.6 217.3,75.8 219.0,75.3 220.7,71.8 222.4,73.8 224.1,72.9 225.8,73.6 227.5,75.2 229.2,76.3 230.8,78.4 232.5,83.6 234.2,87.3 235.9,92.6 237.6,98.2 239.3,102.1 241.0,108.8 242.7,115.8 244.3,123.2 246.0,131.8 247.7,137.6 249.4,147.2 251.1,155.4 252.8,162.3 254.5,167.4 256.2,173.2 257.8,180.0 259.5,184.9 261.2,193.3 262.9,199.3 264.6,205.7 266.3,210.6 268.0,213.5 269.7,218.7 271.3,219.1 273.0,223.4 274.7,226.8 276.4,229.1 278.1,231.4 279.8,233.5 281.5,235.4 283.2,238.5 284.8,238.3 286.5,239.5 288.2,241.9 289.9,242.3 291.6,242.4 293.3,242.0 295.0,244.0 296.7,244.8 298.3,244.2 300.0,246.2 301.7,244.3 303.4,245.8 305.1,246.9 306.8,246.8 308.5,247.0 310.2,247.5 311.8,247.6 313.5,246.8 315.2,246.4 316.9,248.9 318.6,246.2 320.3,247.3 322.0,246.8 323.7,250.1 325.3,249.0 327.0,248.4 328.7,248.4 330.4,249.1 332.1,247.9 333.8,248.7 335.5,248.2 337.2,248.0 338.8,248.8 340.5,250.5 342.2,249.2 343.9,248.6 345.6,247.1 347.3,247.2 349.0,248.9 350.7,249.2 352.3,249.6 354.0,250.0 355.7,246.9 357.4,248.3 359.1,250.5 360.8,249.8 362.5,250.0 364.2,248.8 365.8,251.3 367.5,249.1 369.2,248.4 370.9,249.5 372.6,250.1 374.3,247.6 376.0,247.6 377.7,249.7 379.3,249.1 381.0,249.2 382.7,248.6 384.4,248.6 386.1,248.2 387.8,248.2 389.5,248.3 391.2,247.5 392.8,249.4 394.5,248.6 396.2,247.9 397.9,248.2 399.6,249.3 401.3,246.8 403.0,248.4 404.7,249.1 406.3,250.1 408.0,248.6 409.7,249.4 411.4,248.2 413.1,248.0 414.8,249.2 416.5,248.4 418.2,250.0 419.8,248.5 421.5,250.1 423.2,249.0 424.9,249.7 426.6,248.7 428.3,249.7 430.0,248.2 431.7,249.2 433.3,247.8 435.0,249.9 436.7,248.5 438.4,247.3 440.1,248.5 441.8,248.9 443.5,249.3 445.2,247.5 446.8,249.2 448.5,249.2 450.2,248.6 451.9,248.1 453.6,248.5 455.3,248.6 457.0,247.7 458.7,247.1 460.3,248.3 462.0,248.7 463.7,247.7 465.4,249.2 467.1,249.2 468.8,248.0 470.5,246.8 472.2,250.0 473.8,248.4 475.5,246.7 477.2,248.0 478.9,248.9 480.6,249.0 482.3,247.6 484.0,248.3 485.7,248.8 487.3,248.0 489.0,248.4 490.7,248.5 492.4,248.0 494.1,247.7 495.8,248.8 497.5,247.7 499.2,247.5 500.8,248.0 502.5,248.8 504.2,247.0 505.9,248.6 507.6,247.2 509.3,249.3 511.0,249.6 512.7,249.0 514.3,248.3 516.0,248.7 517.7,246.7 519.4,248.1 521.1,248.0 522.8,249.2 524.5,249.2 526.2,249.3 527.8,248.7 529.5,249.6 531.2,247.7 532.9,248.4 534.6,249.3 536.3,249.0 538.0,247.8 539.7,249.4 541.4,249.1 543.0,247.6 544.7,250.7 546.4,250.1 548.1,249.6 549.8,249.1 551.5,248.6 553.2,248.4 554.9,248.6 556.5,248.5 558.2,249.5 559.9,249.4 561.6,249.2 563.3,249.9 565.0,250.8 566.7,248.8 568.4,249.3 570.0,249.6 571.7,249.2 573.4,248.9 575.1,250.5 576.8,249.8 578.5,249.4 580.2,248.9 581.9,249.4 583.5,249.4 585.2,249.1 586.9,248.8 588.6,249.4 590.3,249.8 592.0,249.2 593.7,249.8 595.4,249.4 597.0,250.0 598.7,249.4"/>
</svg>
</figure>

*Figure 1. Measured absorption spectra of chlorophyll a, chlorophyll b (both dissolved in diethyl ether), and beta-carotene (in hexane), each scaled to its own maximum between 380 and 700 nm. Data: PhotochemCAD database[^pcad], text files by S. Prahl at OMLC. These are measured in a solvent, not inside a leaf or an apple.*

There is a second half to this story, which sits in our eyes. We have three types of cone cells whose sensitivities peak at about 440 nm (S-cones), 545 nm (M-cones), and 565 nm (L-cones)[^kalloniatis]. The brain doesn't receive a full spectrum; it receives three numbers, i.e. how strongly each type of cone fired, and it builds the sensation of colour out of them. Keep this in mind, it will come back to bite us in the last section.

<figure>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="figconet figconed" style="width:100%;height:auto;max-width:640px;font-family:inherit">
  <title id="figconet">Sensitivity of the three human cone types</title>
  <desc id="figconed">S-cones peak near 445 nm, M-cones near 545 nm and L-cones near 570 nm. At the sodium wavelength of 589 nm the L- and M-cones both respond, the L-cones more strongly, and the S-cones not at all.</desc>
  <defs>
    <linearGradient id="figconeg" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#6a00c8"/><stop offset="22%" stop-color="#0050ff"/>
      <stop offset="34%" stop-color="#00b8ff"/><stop offset="47%" stop-color="#00c800"/>
      <stop offset="59%" stop-color="#d8e800"/><stop offset="66%" stop-color="#ffb000"/>
      <stop offset="75%" stop-color="#ff4000"/><stop offset="100%" stop-color="#a00000"/>
    </linearGradient>
  </defs>
  <rect x="60" y="256" width="540" height="10" fill="url(#figconeg)"/>
  <g fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"><line x1="60" y1="250" x2="600" y2="250"/><line x1="60" y1="30" x2="60" y2="250"/></g>
  <g fill="currentColor" font-size="13" text-anchor="middle">
    <text x="94" y="284">400</text>
    <text x="262" y="284">500</text>
    <text x="431" y="284">600</text>
    <text x="600" y="284">700</text>
    <text x="330" y="306">wavelength (nm)</text>
    <text x="22" y="140" transform="rotate(-90 22 140)">sensitivity (normalised)</text>
  </g>
  <line x1="412.7" y1="26" x2="412.7" y2="250" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="412.7" y="20" font-size="13" fill="currentColor" text-anchor="middle">sodium, 589 nm</text>
  <g font-size="13" font-weight="600">
    <line x1="452" y1="44" x2="474" y2="44" stroke="#3b6fd8" stroke-width="3"/><text x="480" y="48" fill="#3b6fd8">S-cones</text>
    <line x1="452" y1="62" x2="474" y2="62" stroke="#2e9e4f" stroke-width="3"/><text x="480" y="66" fill="#2e9e4f">M-cones</text>
    <line x1="452" y1="80" x2="474" y2="80" stroke="#d0403b" stroke-width="3"/><text x="480" y="84" fill="#d0403b">L-cones</text>
  </g>
  <polyline fill="none" stroke="#3b6fd8" stroke-width="2.5" stroke-linejoin="round" points="76.9,247.9 85.3,244.8 93.8,237.5 102.2,223.1 110.6,198.7 119.1,166.1 127.5,130.4 135.9,101.6 144.4,73.4 152.8,51.2 161.2,32.0 169.7,31.9 178.1,39.8 186.6,60.7 195.0,76.9 203.4,87.6 211.9,107.8 220.3,136.4 228.8,164.1 237.2,186.1 245.6,203.4 254.1,214.7 262.5,223.0 270.9,230.4 279.4,236.6 287.8,240.6 296.2,243.6 304.7,245.7 313.1,247.2 321.6,248.2 330.0,248.9 338.4,249.3 346.9,249.6 355.3,249.7 363.8,249.8 372.2,249.9 380.6,249.9 389.1,250.0 397.5,250.0 405.9,250.0 414.4,250.0 422.8,250.0 431.2,250.0 439.7,250.0 448.1,250.0 456.6,250.0"/>
  <polyline fill="none" stroke="#2e9e4f" stroke-width="2.5" stroke-linejoin="round" points="76.9,249.9 85.3,249.8 93.8,249.5 102.2,249.0 110.6,248.1 119.1,246.8 127.5,245.2 135.9,243.5 144.4,241.3 152.8,238.6 161.2,235.7 169.7,233.3 178.1,230.8 186.6,228.4 195.0,224.4 203.4,218.2 211.9,211.3 220.3,204.8 228.8,198.1 237.2,191.0 245.6,183.2 254.1,171.4 262.5,155.9 270.9,136.6 279.4,114.6 287.8,91.8 296.2,70.3 304.7,55.2 313.1,44.1 321.6,36.9 330.0,31.1 338.4,30.6 346.9,35.0 355.3,39.6 363.8,48.1 372.2,57.9 380.6,71.0 389.1,87.1 397.5,106.3 405.9,124.0 414.4,141.6 422.8,159.5 431.2,176.4 439.7,191.7 448.1,204.8 456.6,215.6 465.0,224.3 473.4,231.2 481.9,236.3 490.3,240.2 498.8,243.1 507.2,245.2 515.6,246.6 524.1,247.6 532.5,248.4 540.9,248.9 549.4,249.2 557.8,249.5 566.2,249.6 574.7,249.8 583.1,249.8 591.6,249.9 600.0,249.9"/>
  <polyline fill="none" stroke="#d0403b" stroke-width="2.5" stroke-linejoin="round" points="76.9,249.9 85.3,249.8 93.8,249.5 102.2,248.9 110.6,248.1 119.1,247.1 127.5,245.9 135.9,245.0 144.4,243.8 152.8,242.5 161.2,241.1 169.7,240.1 178.1,239.0 186.6,237.8 195.0,235.8 203.4,232.2 211.9,228.1 220.3,223.9 228.8,219.2 237.2,213.9 245.6,207.9 254.1,198.8 262.5,186.4 270.9,170.9 279.4,152.4 287.8,132.0 296.2,111.7 304.7,95.0 313.1,80.5 321.6,68.3 330.0,56.2 338.4,47.8 346.9,43.2 355.3,37.5 363.8,34.1 372.2,31.2 380.6,30.0 389.1,31.7 397.5,36.7 405.9,39.8 414.4,45.9 422.8,55.1 431.2,66.5 439.7,79.5 448.1,94.7 456.6,111.2 465.0,128.1 473.4,144.4 481.9,161.8 490.3,177.9 498.8,191.5 507.2,203.1 515.6,213.7 524.1,222.6 532.5,229.5 540.9,234.9 549.4,239.0 557.8,242.1 566.2,244.4 574.7,246.1 583.1,247.3 591.6,248.1 600.0,248.7"/>
</svg>
</figure>

*Figure 2. The sensitivity of the three cone types of the human eye, each scaled to a peak of 1. Data: Stockman and Sharpe 2-degree cone fundamentals[^stockman], downloaded from the Colour & Vision Research Laboratory (CVRL) database. Ignore the dashed line for now.*

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

<figure>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="figlort figlord" style="width:100%;height:auto;max-width:640px;font-family:inherit">
  <title id="figlort">Response of a Lorentz oscillator around its resonance</title>
  <desc id="figlord">The imaginary part of the permittivity, which means absorption, is a single peak exactly at the resonance frequency. The real part swings positive just below resonance, crosses zero at resonance, and swings negative just above it.</desc>
  <g fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"><line x1="60" y1="171.4" x2="600" y2="171.4"/><line x1="60" y1="30" x2="60" y2="250"/></g>
  <line x1="330.0" y1="30" x2="330.0" y2="250" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>
  <g fill="currentColor" font-size="13" text-anchor="middle">
    <text x="60" y="272">0.5</text>
    <text x="195" y="272">0.75</text>
    <text x="330" y="272">1</text>
    <text x="465" y="272">1.25</text>
    <text x="600" y="272">1.5</text>
    <text x="330" y="298">driving frequency / resonance frequency</text>
    <text x="22" y="140" transform="rotate(-90 22 140)">response (arbitrary units)</text>
    <text x="330.0" y="24">resonance</text>
  </g>
  <polyline fill="none" stroke="#c0282d" stroke-width="3" stroke-linejoin="round" points="60.0,169.7 62.7,169.7 65.4,169.6 68.1,169.6 70.8,169.5 73.5,169.5 76.2,169.4 78.9,169.4 81.6,169.3 84.3,169.3 87.0,169.2 89.7,169.2 92.4,169.1 95.1,169.1 97.8,169.0 100.5,168.9 103.2,168.9 105.9,168.8 108.6,168.7 111.3,168.7 114.0,168.6 116.7,168.5 119.4,168.4 122.1,168.4 124.8,168.3 127.5,168.2 130.2,168.1 132.9,168.0 135.6,167.9 138.3,167.8 141.0,167.7 143.7,167.6 146.4,167.4 149.1,167.3 151.8,167.2 154.5,167.1 157.2,166.9 159.9,166.8 162.6,166.6 165.3,166.5 168.0,166.3 170.7,166.1 173.4,165.9 176.1,165.7 178.8,165.5 181.5,165.3 184.2,165.1 186.9,164.9 189.6,164.6 192.3,164.3 195.0,164.1 197.7,163.8 200.4,163.5 203.1,163.1 205.8,162.8 208.5,162.4 211.2,162.0 213.9,161.6 216.6,161.2 219.3,160.7 222.0,160.2 224.7,159.6 227.4,159.0 230.1,158.4 232.8,157.8 235.5,157.0 238.2,156.3 240.9,155.4 243.6,154.5 246.3,153.6 249.0,152.5 251.7,151.4 254.4,150.1 257.1,148.8 259.8,147.3 262.5,145.7 265.2,144.0 267.9,142.1 270.6,140.0 273.3,137.7 276.0,135.2 278.7,132.4 281.4,129.4 284.1,126.0 286.8,122.3 289.5,118.3 292.2,113.9 294.9,109.1 297.6,103.9 300.3,98.3 303.0,92.4 305.7,86.1 308.4,79.7 311.1,73.1 313.8,66.7 316.5,60.7 319.2,55.3 321.9,50.9 324.6,47.6 327.3,45.9 330.0,45.7 332.7,47.1 335.4,50.0 338.1,54.2 340.8,59.4 343.5,65.3 346.2,71.7 348.9,78.2 351.6,84.7 354.3,91.0 357.0,97.1 359.7,102.7 362.4,108.0 365.1,112.9 367.8,117.4 370.5,121.5 373.2,125.2 375.9,128.6 378.6,131.7 381.3,134.6 384.0,137.1 386.7,139.5 389.4,141.6 392.1,143.6 394.8,145.3 397.5,147.0 400.2,148.5 402.9,149.8 405.6,151.1 408.3,152.2 411.0,153.3 413.7,154.3 416.4,155.2 419.1,156.1 421.8,156.8 424.5,157.6 427.2,158.2 429.9,158.9 432.6,159.5 435.3,160.0 438.0,160.5 440.7,161.0 443.4,161.5 446.1,161.9 448.8,162.3 451.5,162.6 454.2,163.0 456.9,163.3 459.6,163.6 462.3,163.9 465.0,164.2 467.7,164.5 470.4,164.7 473.1,165.0 475.8,165.2 478.5,165.4 481.2,165.6 483.9,165.8 486.6,166.0 489.3,166.2 492.0,166.3 494.7,166.5 497.4,166.7 500.1,166.8 502.8,166.9 505.5,167.1 508.2,167.2 510.9,167.3 513.6,167.4 516.3,167.6 519.0,167.7 521.7,167.8 524.4,167.9 527.1,168.0 529.8,168.1 532.5,168.1 535.2,168.2 537.9,168.3 540.6,168.4 543.3,168.5 546.0,168.5 548.7,168.6 551.4,168.7 554.1,168.7 556.8,168.8 559.5,168.9 562.2,168.9 564.9,169.0 567.6,169.0 570.3,169.1 573.0,169.1 575.7,169.2 578.4,169.2 581.1,169.3 583.8,169.3 586.5,169.4 589.2,169.4 591.9,169.5 594.6,169.5 597.3,169.5 600.0,169.6"/>
  <polyline fill="none" stroke="#2f6fb0" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="7 4" points="60.0,150.6 62.7,150.5 65.4,150.3 68.1,150.2 70.8,150.1 73.5,149.9 76.2,149.8 78.9,149.6 81.6,149.4 84.3,149.3 87.0,149.1 89.7,148.9 92.4,148.8 95.1,148.6 97.8,148.4 100.5,148.2 103.2,148.0 105.9,147.8 108.6,147.6 111.3,147.4 114.0,147.2 116.7,147.0 119.4,146.8 122.1,146.5 124.8,146.3 127.5,146.1 130.2,145.8 132.9,145.6 135.6,145.3 138.3,145.0 141.0,144.7 143.7,144.5 146.4,144.2 149.1,143.9 151.8,143.6 154.5,143.2 157.2,142.9 159.9,142.6 162.6,142.2 165.3,141.9 168.0,141.5 170.7,141.1 173.4,140.7 176.1,140.3 178.8,139.9 181.5,139.5 184.2,139.0 186.9,138.6 189.6,138.1 192.3,137.6 195.0,137.1 197.7,136.6 200.4,136.0 203.1,135.5 205.8,134.9 208.5,134.3 211.2,133.6 213.9,133.0 216.6,132.3 219.3,131.6 222.0,130.9 224.7,130.2 227.4,129.4 230.1,128.6 232.8,127.7 235.5,126.9 238.2,126.0 240.9,125.0 243.6,124.1 246.3,123.1 249.0,122.0 251.7,121.0 254.4,119.9 257.1,118.7 259.8,117.6 262.5,116.4 265.2,115.2 267.9,113.9 270.6,112.7 273.3,111.4 276.0,110.2 278.7,109.0 281.4,107.9 284.1,106.8 286.8,105.9 289.5,105.1 292.2,104.6 294.9,104.4 297.6,104.6 300.3,105.2 303.0,106.5 305.7,108.6 308.4,111.5 311.1,115.4 313.8,120.4 316.5,126.6 319.2,133.9 321.9,142.3 324.6,151.5 327.3,161.4 330.0,171.4 332.7,181.3 335.4,190.8 338.1,199.3 340.8,206.9 343.5,213.3 346.2,218.6 348.9,222.7 351.6,225.9 354.3,228.1 357.0,229.5 359.7,230.3 362.4,230.6 365.1,230.4 367.8,230.0 370.5,229.3 373.2,228.4 375.9,227.3 378.6,226.2 381.3,225.0 384.0,223.8 386.7,222.6 389.4,221.3 392.1,220.1 394.8,218.8 397.5,217.6 400.2,216.5 402.9,215.3 405.6,214.2 408.3,213.1 411.0,212.1 413.7,211.1 416.4,210.1 419.1,209.1 421.8,208.2 424.5,207.4 427.2,206.5 429.9,205.7 432.6,204.9 435.3,204.2 438.0,203.4 440.7,202.7 443.4,202.0 446.1,201.4 448.8,200.7 451.5,200.1 454.2,199.5 456.9,199.0 459.6,198.4 462.3,197.9 465.0,197.4 467.7,196.9 470.4,196.4 473.1,195.9 475.8,195.5 478.5,195.0 481.2,194.6 483.9,194.2 486.6,193.8 489.3,193.4 492.0,193.0 494.7,192.6 497.4,192.3 500.1,191.9 502.8,191.6 505.5,191.3 508.2,191.0 510.9,190.6 513.6,190.3 516.3,190.0 519.0,189.8 521.7,189.5 524.4,189.2 527.1,188.9 529.8,188.7 532.5,188.4 535.2,188.2 537.9,188.0 540.6,187.7 543.3,187.5 546.0,187.3 548.7,187.1 551.4,186.8 554.1,186.6 556.8,186.4 559.5,186.2 562.2,186.0 564.9,185.9 567.6,185.7 570.3,185.5 573.0,185.3 575.7,185.1 578.4,185.0 581.1,184.8 583.8,184.6 586.5,184.5 589.2,184.3 591.9,184.2 594.6,184.0 597.3,183.9 600.0,183.7"/>
  <g font-size="13" font-weight="600">
    <text x="372" y="70" fill="#c0282d">imaginary part: absorption</text>
    <text x="595" y="232" fill="#2f6fb0" text-anchor="end">real part: bending of light</text>
  </g>
</svg>
</figure>

*Figure 3. The response of a single Lorentz oscillator, computed from the equation above with a quality factor $$Q = \omega_0/\gamma = 8$$. This is the model itself, not a measurement. Absorption (red) peaks at the resonance and is small far away from it; the real part (blue, dashed) changes sign across the resonance.*

Now look at it with an engineer's eyes. In wireless power transfer, the receiver coil is tuned with a capacitor so that it resonates at the transmitter's frequency; at resonance it pulls the most power out of the field, and a little away from resonance it pulls much less. How wide that window is depends on the losses, i.e. on the quality factor $$Q = \omega_0 / \gamma$$. A pigment is the same thing at 500 THz: chlorophyll has resonances in the blue and in the red, and those are the frequencies it takes out of sunlight (Figure 1). The broad humps in Figure 1 are, in this language, low-$$Q$$ resonances. So when I say an apple "absorbs green", what I really mean is that the apple's skin is full of tiny receivers tuned to green.

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

*Figure 4. A schematic, not measured data: I couldn't find an openly licensed measured spectrum of apple skin to plot. The dip of the green curve near 670 nm is chlorophyll absorbing red; the red curve stays low wherever anthocyanin absorbs (around 550 nm) and rises only beyond about 600 nm. The shapes follow the absorption bands reported by Merzlyak et al.[^merzlyak] Ignore the dashed line for now.*

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

And what gets added is a new pigment. Inside an apple cell, the enzyme polyphenol oxidase (PPO) sits in small compartments called plastids, while its raw material, the phenolic compounds, is stored in the vacuole. In a healthy cell the two never meet, so there is no browning. When the compartments break, by cutting, bruising, insects, or simply by ageing, the enzyme meets the phenolics in the presence of oxygen and turns them into quinones, which then chemically link up into brown polymers[^murata]. The same mechanism is behind the browning of fresh-cut apple, puree, and juice, which the food industry spends a lot of effort to prevent[^arnold]. In the language of the electromagnetic section, the broken cell builds a brand new set of receivers.

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
    <text x="485" y="206">phenolics + PPO + oxygen: brown pigment</text>
  </g>
  <g fill="#8b5a2b">
    <circle cx="420" cy="90" r="7"/><circle cx="455" cy="120" r="9"/><circle cx="500" cy="85" r="6"/>
    <circle cx="530" cy="135" r="8"/><circle cx="480" cy="150" r="6"/><circle cx="560" cy="95" r="7"/>
    <circle cx="410" cy="140" r="6"/><circle cx="515" cy="110" r="5"/>
  </g>
</svg>
</figure>

*Figure 5. Enzymatic browning in one picture, following Murata[^murata].*

The best evidence is an apple which doesn't brown. The Arctic apple is a genetically engineered apple in which four PPO genes are suppressed, and the result is a non-browning apple; it was cleared by the USDA in 2015[^usda]. If browning were about cells disappearing and reflecting less, silencing one enzyme wouldn't have stopped it.

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

<figure>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="figfrt figfrd" style="width:100%;height:auto;max-width:640px;font-family:inherit">
  <title id="figfrt">Fraction of light reflected at a single boundary</title>
  <desc id="figfrd">cell wall | air: 3.07 percent; water | air: 2.01 percent; cell wall | water: 0.12 percent.</desc>
  <text x="150" y="49" font-size="14" fill="currentColor" text-anchor="end">cell wall | air</text>
  <rect x="160" y="30" width="380.0" height="28" fill="#c9a227"/>
  <text x="546.0" y="49" font-size="14" font-weight="600" fill="currentColor">3.07%</text>
  <text x="150" y="99" font-size="14" fill="currentColor" text-anchor="end">water | air</text>
  <rect x="160" y="80" width="248.2" height="28" fill="#8aa9c9"/>
  <text x="414.2" y="99" font-size="14" font-weight="600" fill="currentColor">2.01%</text>
  <text x="150" y="149" font-size="14" fill="currentColor" text-anchor="end">cell wall | water</text>
  <rect x="160" y="130" width="14.7" height="28" fill="#2f6fb0"/>
  <text x="180.7" y="149" font-size="14" font-weight="600" fill="currentColor">0.12%</text>
  <text x="160" y="182" font-size="13" fill="currentColor">light reflected at one boundary, at normal incidence</text>
</svg>
</figure>

*Figure 6. Fraction of light reflected at a single boundary, computed from the Fresnel equation using the refractive indices of plant cell walls (1.425)[^gausman], water (1.33)[^halequerry], and air.*

One boundary reflects only 3%, but light inside the flesh meets a very large number of them, and bit by bit most of it gets sent back out, so the flesh looks white. Now replace the air with water: each boundary reflects about 25 times less, the light goes deep and gets absorbed or passes through, and the tissue looks darker and glassy. This is not just a calculation. Gausman and co-workers pushed liquids into the air spaces of leaves and found that infiltrated leaves reflected less light over the whole 500 to 2500 nm range, precisely because the cell wall to air boundaries were removed[^gausman]; Woolley did similar infiltration experiments[^woolley]. And apples do it to themselves. In a disorder called *watercore*, the air spaces in the flesh fill up with a sorbitol-rich liquid, and the affected flesh looks translucent and glassy[^umdwater].

<figure>
<img src="/assets/images/why-is-an-apple-red/watercore.jpg" alt="An apple cut in half, lying on a pile of red apples. Most of the cut flesh is glassy and translucent instead of white." loading="lazy" style="width:100%;max-width:384px;height:auto">
</figure>

*Figure 7. An apple with watercore. The glassy flesh has its air spaces filled with liquid, so it scatters much less light. Photo: [Red58bill](https://commons.wikimedia.org/wiki/File:Watercore.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0), via Wikimedia Commons.*

So there *is* a way for an apple to reflect less without any new pigment: take away the air-filled boundaries between its cells. My guess said "fewer cells"; the physics says "fewer cell-to-air boundaries". That is not what makes a cut apple brown, but it is a real way to make apple flesh darker, and I didn't expect my wrong guess to land so close to it.

And real rot is someone else's work, lol! The soft, watery, spreading brown patch on a stored apple is mostly fungi. The most important one is *Penicillium expansum*, which causes blue mould; it enters through fresh wounds like stem punctures, bruises, and even scratches from pickers' fingernails, and makes lesions which are soft, watery, and light brown, later covered with bluish-green spores[^janisiewicz]. So decay is the apple being eaten by fungi, and browning is the apple's own chemistry; in neither case are fewer cells the reason.

<figure>
<img src="/assets/images/why-is-an-apple-red/blue-mould.jpg" alt="Close-up of rotting apple flesh with small white stalks topped with blue-green spore masses." loading="lazy" style="width:100%;height:auto">
</figure>

*Figure 8. Blue mould (Penicillium expansum) on an apple. The little stalks carry the blue-green spore masses. Photo: [ImagePerson](https://commons.wikimedia.org/wiki/File:Blue_Mold_Penicillium_expansum_aspore_masses_on_apple_4461.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via Wikimedia Commons.*

## A red apple under yellow light

Now the fun one. Suppose the apple is *pure* red: it reflects only red light and absorbs everything else. Put it under a light source which emits only yellow. There is nothing in the incoming light which the apple can reflect, so nothing comes back, and the apple looks black.

Such a light source exists and was, for a long time, hanging over our streets: the low-pressure sodium lamp. Its light is almost entirely two lines very close to each other, at 588.995 nm and 589.592 nm[^nist], the famous sodium D lines. Under this lamp there is "essentially no color rendition"[^flagstaff]: every object looks like a brighter or darker shade of the same yellow-orange. (Astronomers love these lamps for exactly this reason: all the light pollution sits at one wavelength, which is easy to filter out[^flagstaff].)

<figure>
<img src="/assets/images/why-is-an-apple-red/sodium-street.jpg" alt="A tram line and road at night in Mainz lit by orange low-pressure sodium street lamps. The grass beside the tracks looks yellow-brown rather than green." loading="lazy" style="width:100%;height:auto">
</figure>

*Figure 9. A street in Mainz, Germany, under low-pressure sodium lamps. Look at the grass: it has no green left, only shades of the lamp's own colour. The few things that still show colour, like the billboards, have their own light. The photographer notes that the camera makes the light look more yellow than it does to the eye. Photo: [ManuelB701](https://commons.wikimedia.org/wiki/File:Mainz-Oberstadt_-_Geschwister-Scholl-Stra%C3%9Fe,_Stra%C3%9Fenbahn_Hechtsheim_unter_Natriumdampflicht.jpg), CC0, via Wikimedia Commons.*

A real apple is not *pure* red, so it is not perfectly black either. Look at the dashed line in Figure 4: at 589 nm the red apple sits right at the edge of its anthocyanin absorption, so it reflects only a little. Under a sodium lamp it would look like a dark, dull, brownish version of the lamp's colour. A green apple reflects more at 589 nm, so it would likely look *brighter* than the red one. You would no longer be able to tell a red apple from a green apple by colour at all; only by how bright or dark it is.

Our eyes explain why. Look at the dashed line in Figure 2: at 589 nm the S-cones hardly respond at all, and the M- and L-cones respond in a fixed ratio. Whatever the object, the brain gets the same pair of numbers, just scaled up or down with brightness. One ratio means one colour, and all that is left is light and dark.

### Don't test this with your phone

Here is the trap. If you open a picture of plain yellow on your phone and hold an apple in front of it, the apple will still look reddish. Why? Because your screen has no yellow light. Each pixel has only red, green, and blue sub-pixels, and "yellow" on a screen is red plus green light at the same time. Our eyes can't tell the difference: all that matters is how strongly the M- and L-cones fire, and a suitable mix of red and green makes them fire just like pure 589 nm light does. This is the whole reason almost any colour can be matched by mixing three primaries[^kalloniatis]. Two lights with completely different spectra look the same to us, but the apple is not fooled: it reflects the red part of your "yellow" screen and looks red.

So to do this experiment properly, you need truly monochromatic light:

1. A sodium lamp, if you can still find one.
2. A sodium flame. Sprinkle a pinch of table salt into a gas flame (a gas stove works) in a dark room. The bright yellow you see is the same sodium D-line emission[^nist]. It is not very bright, so keep the apple close, and be careful with the fire.
3. A narrow-band filter around 589 nm in front of a white torch, if you happen to have one in a lab.

Put a red apple, a green apple, and something white next to each other and watch the colours drain out. I'd love to see your photos if you try this :)

## Try it yourself

If you don't have a sodium lamp lying around (I don't either), here is a small game. For every question, the page actually computes the colour: it multiplies the spectrum of the light with how much the object reflects at each wavelength, feeds that into the standard colour-matching functions of the human eye[^cie1931], and converts the result into a colour your screen can show. Sunlight is the CIE standard daylight spectrum D65[^d65], and the leaf is a real apple leaf, measured with a spectroradiometer[^braun]. Guess first, then read why.

<div id="colour-game" class="colour-game"><noscript>This game needs JavaScript.</noscript></div>
<script src="/assets/js/colour-game.js" defer></script>

*A few things to know about the game. The two apples use the schematic curves of Figure 4, not measured data. The phone's "yellow" is modelled as two narrow bands at 530 and 620 nm, mixed so that the cones see the same ratio as they do for 589 nm light; real screens differ a little. White paper is idealised as reflecting 90% at every wavelength. And your screen cannot show the pure, saturated yellow of a sodium lamp at all, so the game shows the closest colour it can.*

## So, how does anything take colour?

Putting it all together: an object's colour is the part of the light which it doesn't absorb, as decoded by three types of cells in our eyes. The absorbing is done by molecules which behave like tiny tuned receivers, and the reflecting is helped along by every boundary where the refractive index jumps. An apple is green when chlorophyll is taking out the red and blue, red when anthocyanin is taking out the green, brown when broken cells let an enzyme build a new brown pigment, and glassy when its air pockets fill with liquid. Change the light and the colour changes with it.

Until next time.

---

## References

[^nasa]: NASA Science, "Visible Light." <https://science.nasa.gov/ems/09_visiblelight/>

[^vangrondelle]: R. van Grondelle and E. Boeker, "Limits on Natural Photosynthesis," *The Journal of Physical Chemistry B*, 2017. <https://pmc.ncbi.nlm.nih.gov/articles/PMC5647561/>

[^pcad]: J. M. Dixon, M. Taniguchi, and J. S. Lindsey, "PhotochemCAD 2: A Refined Program with Accompanying Spectral Databases for Photochemical Calculations," *Photochemistry and Photobiology*, vol. 81, pp. 212--213, 2005, <https://doi.org/10.1111/j.1751-1097.2005.tb01544.x>; data files from S. Prahl, Oregon Medical Laser Center, <https://omlc.org/spectra/PhotochemCAD/>

[^kalloniatis]: M. Kalloniatis and C. Luu, "Color Perception," in *Webvision: The Organization of the Retina and Visual System*. <https://www.webvision.pitt.edu/book/part-viii-psychophysics-of-vision/color-perception/>

[^stockman]: A. Stockman and L. T. Sharpe, "The spectral sensitivities of the middle- and long-wavelength-sensitive cones derived from measurements in observers of known genotype," *Vision Research*, vol. 40, no. 13, pp. 1711--1737, 2000, <https://doi.org/10.1016/S0042-6989(00)00021-3>; data from the CVRL database, <http://www.cvrl.org/cones.htm>

[^clark]: J. Clark, "What Causes Molecules to Absorb UV and Visible Light," Chemistry LibreTexts. <https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Supplemental_Modules_(Physical_and_Theoretical_Chemistry)/Spectroscopy/Electronic_Spectroscopy/Electronic_Spectroscopy_Basics/What_Causes_Molecules_to_Absorb_UV_and_Visible_Light>

[^nist_h]: NIST, "CODATA Value: Planck constant." <https://physics.nist.gov/cgi-bin/cuu/Value?h>

[^colton]: J. Colton, "Lorentz Oscillator Model of the Dielectric Function," Physics 581 course notes, Brigham Young University, 2020. <https://physics.byu.edu/faculty/colton/docs/phy581-resources/lorentz-oscillator-model-of-the-dielectric-function.pdf>

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

[^herremans]: E. Herremans et al., "Spatial development of transport structures in apple (*Malus × domestica* Borkh.) fruit," *Frontiers in Plant Science*, vol. 6, 2015. <https://doi.org/10.3389/fpls.2015.00679>

[^gausman]: H. W. Gausman, W. A. Allen, and D. E. Escobar, "Refractive Index of Plant Cell Walls," *Applied Optics*, vol. 13, no. 1, p. 109, 1974. <https://doi.org/10.1364/AO.13.000109>

[^halequerry]: G. M. Hale and M. R. Querry, "Optical Constants of Water in the 200-nm to 200-μm Wavelength Region," *Applied Optics*, vol. 12, no. 3, p. 555, 1973. <https://doi.org/10.1364/AO.12.000555>

[^woolley]: J. T. Woolley, "Reflectance and Transmittance of Light by Leaves," *Plant Physiology*, vol. 47, no. 5, pp. 656--662, 1971. <https://doi.org/10.1104/pp.47.5.656>

[^umdwater]: M. Farcuh, "Water core in apples: what is it, what causes it and how can it be controlled?," University of Maryland Extension. <https://extension.umd.edu/resource/water-core-apples-what-it-what-causes-it-and-how-can-it-be-controlled>

[^cie1931]: CIE, "CIE 1931 colour-matching functions, 2 degree observer," CIE data table, <https://doi.org/10.25039/CIE.DS.xvudnb9b>; values used from the CVRL database, <http://www.cvrl.org/>

[^d65]: CIE, "CIE standard illuminant D65," CIE data table. <https://doi.org/10.25039/CIE.DS.hjfjmt59>

[^braun]: A. Braun et al., "A Multi-Temporal Field Spectroscopy Dataset of Apple Leaf Reflectance for Tree Vitality Monitoring," Zenodo, 2026, CC BY 4.0. <https://doi.org/10.5281/zenodo.22143346> The game uses the mean of the 30 spectra measured on 16 July 2025.

[^janisiewicz]: W. Janisiewicz and A. R. Biggs, "Blue Mold on Apple," Extension Foundation. <https://apples.extension.org/blue-mold-on-apple/>

[^nist]: NIST, "Handbook of Basic Atomic Spectroscopic Data: Strong Lines of Sodium." <https://physics.nist.gov/PhysRefData/Handbook/Tables/sodiumtable2.htm>

[^flagstaff]: Flagstaff Dark Skies Coalition, "Low Pressure Sodium Lighting." <https://flagstaffdarkskies.org/low-pressure-sodium-lighting/>
