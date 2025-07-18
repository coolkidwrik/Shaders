<!-- github does no allow CSS -->
<!-- <style>
  .container {
    display: flex;
  }
  .image-container {
    flex: 1;
  }
  .image-container img {
    width: 200px;
    height: 175px;
  }
  .image-container p {
    text-align: center;
  }
</style> -->

# Shaders
## Various shaders written in GLSL
### [Click here for Demo](https://wrik-shaders-demo.vercel.app/)

<h3><ins>Controls</ins></h3>
<ins>Lighting</ins>

There is a rainbow orb on the scene which acts as dynamic lighting. This orb can be controlled as follows:
<ul>
  <li>↑: forward</li>
  <li>↓: backwards</li>
  <li>→: right</li>
  <li>←: left</li>
  <li>Q: up</li>
  <li>R: down</li>
</ul>
<ins>Shaders</ins>

The light from this orb will interact with the subject of the scene, to which the shader is applied. Change the shader applied to the subject using the following keys:
<ul>
  <li>1: Phong</li>
  <li>2: Blinn-Phong</li>
  <li>3: Diamond</li>
  <li>4: Noise</li>
  <li>5: Polka-Dots</li>
  <li>6: Toon</li>
  <li>7: Toon-Glass</li>
  <li>8: Static</li>
</ul>
<ins>Geometry</ins>

The default geometry of the subject is a ball. This can be changed as follows:
<ul>
  <li>shift + A: Armadillo</li>
  <li>shift + B: Ball</li>
</ul>
<ins>Scene</ins>

To view how the shaders might look in different environments, we can change the background environment using the following:
<ul>
  <li>shift + 0: No Background</li>
  <li>shift + 1: Paris Benches</li>
  <li>shift + 2: Starry Night</li>
  <li>shift + 3: Open Sky</li>
</ul>
<ins>HDR Image Options</ins> 

GUI in the top right corner enables options to change renderer tone mapping, as well as lighting exposure from the background.

<h3><ins>Demo</ins></h3>

<!-- <div display="flex">
  <div>
    <img src="./images/blinn_orb.png" alt="blinn_ball" width="200" height="175">
    <p>Blinn-Phong</p>
  </div>

  <div>
    <img src="./images/toon_orb.png" alt="toon_ball" width="200" height="175">
    <p>Toon</p>
  </div>

  <div>
    <img src="./images/noise_orb.png" alt="noise_ball" width="200" height="175">
    <p>Noise</p>
  </div>
</div> -->
<p align="center"><ins>Static Shaders</ins></p>
<table>
  <tr>
    <td align="center"> </td>
    <td align="center">Blinn-Phong</td>
    <td align="center">Toon</td>
    <td align="center">Static</td>
  </tr>
  <tr>
    <td align="center">Ball</td>
    <td><img src="./images/blinn_orb.png" alt="blinn_ball" width="220" height="192.5"></td>
    <td><img src="./images/toon_orb.png" alt="toon_ball" width="220" height="192.5"></td>
    <td><img src="./images/static_orb.png" alt="toon_ball" width="220" height="192.5"></td>
  </tr>
  <tr>
    <td align="center">Armadillo</td>
    <td><img src="./images/armadillo_blinn.png" alt="blinn_ball" width="220" height="220"></td>
    <td><img src="./images/armadillo_toon.png" alt="toon_ball" width="220" height="220"></td>
    <td><img src="./images/armadillo_static.png" alt="noise_ball" width="220" height="220"></td>
  </tr>
</table>

<p align="center"><ins>Animated Shaders</ins></p>

<table>
  <tr>
    <td align="center">Diamond</td>
    <td align="center">Noise</td>
    <td align="center">Polka-Dots</td>
  </tr>
  <tr>
    <td><img src="./images/diamond.gif" alt="toon_ball" width="250" height="250"></td>
    <td><img src="./images/noise.gif" alt="toon_ball" width="250" height="250"></td>
    <td><img src="./images/dots.gif" alt="toon_ball" width="250" height="250"></td>
  </tr>
</table>

<p align="center"><ins>Physical Based Rendering(PBR) and Image Based Lighting(IBL)</ins></p>
You can place the damaged helmet onto the scene by pressing 
<ul>
  <li>shift+H </li>
</ul> 
The properties of the helmet like normals, metalness and emissiveness were set using PBR textures. Furthermore, the surface of the helmet reflects the background scene using IBL.
<table>
  <tr>
    <td align="center">Paris Scene</td>
    <td align="center">Starry Scene</td>
    <td align="center">Sky Scene</td>
  </tr>
  <tr>
    <td><img src="./images/helmet/paris_helmet.gif" alt="toon_ball" width="250" height="250"></td>
    <td><img src="./images/helmet/starry_helmet.gif" alt="toon_ball" width="250" height="250"></td>
    <td><img src="./images/helmet/sky_helmet.gif" alt="toon_ball" width="250" height="250"></td>
  </tr>
</table>


