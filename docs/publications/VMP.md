# Vehicle Model Predictor with 6-DoF (VMP)
This was my Final **Bachelor's Degree Project** at the University of Alcalá de Henares.
In it, at the last page, it's all the external links and bibliography I used for research.

The **motivation** for the research is to find a mathematically accurate vehicle model, which can predict the 6 degrees of freedom (DoF) of a vehicle in motion.
With it, the model could help at autonomous driving applications.
Within the main idea, it was desired to implement the model at an odometry application to improve the efficiency of the *Unscented Kalman Filter* (UKF).

<div align="center">
    <img src="../../assets/images/vmp/full_vehicle.png" width=500 alt="vehicle_model">
</div>

## Project specifications

The first step was to set all the signals and variables that the model would need:

  - *State variables:*
    - Cartesian positioning along all axes: $X, Y, Z$
    - Rotation along all axes: $roll, pitch, yaw$ or $\theta, \phi, \psi$
  - *Input control signals:*
    - Position of the steering wheel: *&lambda;*
    - Vehicle speed: *V*

<div align="center">
  <img src="../../assets/images/vmp/rpy.png" width=500 alt="roll_pitch_yaw">
</div>  

Some additional criteria was also specified to simplify the model:

  - The vehicle is a four tyres private car
  - The vehicle travels without any significant load
  - The model works for low velocity (urban routes)
  - The road has no slope and no bumps

With it, the final model is defined as a **combination** of different mathematical and/or physical models.

## Vehicle characterization

### Relation steering wheel and front tyres rotation

As specified before, one of the control signals is the steering wheel position (as an angle).
However, this data has to be transformed into a front tyre rotation to be used at the model.
By following the Ackerman turning model, the rotation of the tyre is greater at the inner wheel than the outer.

<div align="center">
<img src="../../assets/images/vmp/Ackerman.png" alt="ackerman" width=500>
</div>

With this information, the final solution will show the ratio steering wheel / middle tyre.
The middle tyre does not exist physically, but it will be used as an approximation.
For the ratio calculation, a Citröen C4 is used as the test model for all physical measurements.
Thus, the first measurement was for the tyres rotation, obtaining the following results:

<div align="center">
<img src="../../assets/images/vmp/tyres_rotation.png" alt="tyres_rotation" width=650>
</div>

At the graph, the orange function represents the left tyre and the blue one, the right tyre.
The ratio was obtained by the second degree equation of the curve created by the mean of both, the left and right tyres, measurements.

$$
ratio = 15.75 + 2 * 10^{-16} * \lambda - 4 * 10^{-6} * \lambda^{2}
$$

By taking care of no linealities, the front middle tyre rotation (*&delta;*) is defined as following:

*&delta; = arctan(&lambda; &frasl; ratio)*

### Center of Gravity (CG)
The CG is the imaginary point around which all resultant torques vanish.
Thus, by definition, the CG is positioned within the body as a function of the weight distribution.<br />
By analyzing a vehicle; and defining the axis as X to the front, Y to the left and Z upwards; its CG is position:
  
  - Closer to the front of the vehicle at the X axis.
  - At the origin at the Y axis, because a vehicle is laterally well-balanced.
  - Close to the ground (the origin) at the axis Z but with height.

The only two coordinates that are not known are the X and Z position.
These can be found at any vehicle by realizing two weight measurements and aplying trigonometry:

| First measurement | Second measurement|
|--------------- | ---------------|
|<img src="../../assets/images/vmp/side_cg.png" alt="CG" width=450> | <img src="../../assets/images/vmp/side_elev_cg.png" alt="elevated_CG" width=450>|

With the **first measurement** it's known the front and rear mass (*M<sub>f</sub>, M<sub>r</sub>*).
Applying these terms to the equilibrium equation, the distance from CG to the front and the rear distance (*l<sub>f</sub>, l<sub>r</sub>*) are found,
defining the CG position along the X axis.
At the next equations, *L* represents the wheelbase of the vehicle.

*l<sub>f</sub> = L &sdot; M<sub>r</sub> / M* <br />
*l<sub>r</sub> = L &sdot; M<sub>f</sub> / M = L &minus; l<sub>f</sub>*

With the **second measurement**, *H* is a selected height to elevate the rear part of the vehicle.
Applying basic trigonometry, the angle represented as *&#1012;* is also known. 
Therefore, because of the new mass distribution due to the elevation, the front and rear masses (*M<sub>1</sub>, M<sub>2</sub>*) are different.
<br />Then the height of the CG is defined by the following mathematical relation:

*Z<sub>CG</sub> = (M<sub>1</sub> &sdot; l<sub>f</sub> &minus; M<sub>2</sub> &sdot; l<sub>r</sub>)
/ (M &sdot; tan(&#1012;))*

With that las equation, all coordinates of the CG are known.

### Model of one-fourth vehicle: Damper model
When a vehicle is in motion, the angles of pitch and roll appear when it changes its speed and/or it takes a turn.
This effect can only exist if the mechanical properties of the vehicle allows it.
If we imagine a metal rod, the rod cannot be compressed to change its total length.
However, if we imagine a spring, it can be compressed.

A vehicle experiences this effect because it has a damper system joining each tyre to the chassis.
There are also two anti-roll rods: one joining the front tyres and one joining the rear tyres, but these will be neglected at the model.
Thus, the last part to characterize of the vehicle is the system of the dampers.

<div align="center">
<img src="../../assets/images/vmp/dumper.png" alt="dumper" width=250>
</div>

The compression force that experiences a damper (*F<sub>ci</sub>*) 
is defined by a second order equation, in function of the chassis displacement:

*F<sub>ci</sub> = &minus; K<sub>i</sub> (z<sub>s</sub> &minus; z<sub>s0</sub>)
&minus; D<sub>i</sub> (&zdot;<sub>s</sub> &minus; &zdot;<sub>s0</sub>) 
&plus; m<sub>si</sub> &sdot; g*

At the equation, each letter represents:

  - *'i'* is the number representing each corner of the vehicle, going from 1 to 4.
  - *'K'* is the spring constant
  - *'D'* is the coefficient of friction of the damper 
  - *'m<sub>s</sub>'* is the chassis mass hold by the damper

To model all dampers is not needed to make all calculations four times.
Both front dampers are equal and both rear dampers are equal.
Then calculations are only needed to be carry twice.<br />
And at last, two approximations will be applied:

  - The tyre doesn't deform. All the vertical displacement will be hold at the damper.
  - The model of a single damper is a 1-DoF model. It only accepts vertical displacement and doesn't have any rotations.

With the previous statements and at a static state, the damper's force is equal to the weight of the chassis. 
Then the only acceleration is the gravity.
Applying it at the previous equation, the constant *K* can be defined.
For it, the vertical displacement will be the difference of the extended spring minus the length of the spring when the vehicle is at rest on the floor. 

*K<sub>i</sub>(z<sub>s</sub> &minus; z<sub>s0</sub>) =  m<sub>si</sub> &sdot; g*

With it, the only remaining parameter is the coefficient of friction *D*. 
To calculate it, the full equation has to be reorganized at the Laplace domain to obtain the transfer function.
For it, *Z<sub>s</sub>* is the output and *Z<sub>s0</sub>* the input.

*Z<sub>s</sub> (s) / Z<sub>s0</sub> (s) = 
(D &sdot; + K) / 
(m<sub>s</sub> &sdot; s<sup>2</sup> + D &sdot; + K)*

The parameters are obtained by analyzing the characteristic equation from the transfer function.
This one has to be compared to the second order equation of a damped system.

*s<sup>2</sup> + s &sdot; D / m<sub>s</sub> + K / m<sub>s</sub> = 
s<sup>2</sup> + s &sdot; 2 &xi; &omega; <sub>n</sub> + &omega;<sub>n</sub><sup>2</sup>*

By comparing the terms all the parameters can be obtained as long as *&xi;* is defined.
The *&xi* at a damper is not constant, taking a value among *0.7* and *0.9*.
However, taking in consideration the final model won't travel at fast velocities and 
the road is considered in good conditions, its value will be considered constant at *0.7*

*&omega;<sub>n</sub> = &radic;(K / m<sub>s</sub>)*  <br/>
*D = 2 &omega;<sub>n</sub> m<sub>s</sub> &xi;*

For a more precise approach, a curve force-velocity should be analyzed at a test bench.
This curve characterizes the *&xi;* factor of a damper.

## Bicycle model
The simplified bicycle model aliases the trajectory of a vehicle assuming it only has one front wheel and one rear wheel.
With a 2D analysis, this model only has 3 state variables, which represent the DoF of the model, and 2 control signals:

  - State variables: {*X, Y, &psi;*}
  - Control signals: {*V, &delta;*}

As it can be noticed, a control signal is the rotation of the front wheel (*&delta;*).
Previously has been proven how to obtain this parameter prom the steering wheel position, 
so from now on all equations will show only the *&delta;* parameter.

<div align="center">
<img src="../../assets/images/vmp/bicycle.png" alt="bicycle" width=500>
</div>

The basics of physics establish that a coefficient of friction *&mu;* is needed, between the tyres and the road, for the vehicle being able to travel.
An infinite *&mu;* would mean a perfect adhesion of the vehicle to the ground, resulting in a perfect trajectory when turning.
At the contrary, a *&mu;* with a very low value would mean to the vehicle to slip.
A clear example of the vehicle slipping is driving on ice.

The difference of the ideal track and the real one is defined the slip angle(*&beta;*).

<img src="../../assets/images/vmp/slip_angle.png" alt="slip_angle" width=500>

With the *&beta;* the instantaneous trajectory (*&gamma;*) is defined as the sum of the yaw and the slip angle.

*&gamma; = &psi; + &beta;*

However, *&gamma;* doesn't show he real evolution of the track.
Therefore, a further analysis is needed to find the derivate of the state variables.
This is done by applying trigonometry to the bicycle diagram to know *&beta;*

*&beta; = arctan(l<sub>r</sub> &sdot; tan(&delta;) / L)*

By knowing *&beta* it is known *&gamma;* and the differences at velocity for each of the state variables.

*d/dt &sdot; X = V &sdot; cos(&psi; + &beta;)* <br />
*d/dt &sdot; Y = V &sdot; sin(&psi; + &beta;)* <br />
*d/dt &sdot; &psi; = V &sdot; sin(&beta;)/l<sub>r</sub>* <br />

## Cinematic models
### Roll approximation
Masato Abe and W. Manning present a way to determine the steady state value of the roll of a moving vehicle,
documented at their book *Vehicle Handling Dynamics*.
For it, they announce only certain parameters are needed:

  - The mass of the chassis (*m<sub>s</sub>*)
  - The distance from the CG to the roll axis (*d<sub>roll</sub>*)
  - The anti-roll constant (*K<sub>&theta;</sub>*), being composed by all four dampers and the anti-roll bars.

With these parameters, they establish the roll is a function of the lateral acceleration (*a<sub>y</sub>*).

*&theta; = f(a<sub>y</sub>) = 
a<sub>y</sub> &sdot; (m<sub>s</sub> &sdot; d<sub>roll</sub>) / K<sub>&theta;</sub>*

With the previous statement of the vehicle travelling at low speed, 
the approximation of calculating the roll with the steady state value could be a correct approximation.

### Pitch approximation
Based on the theory of Masato Abe and W. Manning, a steady state pitch approximation model was developed.
It has the same bases as the previous model, but adapted to the pitch angle.

*&phi; = f(a<sub>x</sub>) = 
a<sub>x</sub> &sdot; (m<sub>s</sub> &sdot; d<sub>pitch</sub>) / K<sub>&phi;</sub>*

## Dynamic model for pitch and roll
This model was based on the studies made by Chalmers' University. 
Here, a physical model was detailed and analyzed by semi-vehicle models to calculate the force momentum.
These half-models combined create a full vehicle model that predicts the increment in acceleration for the pitch and roll angles.

### Pitch-model
To calculate how the pitch evolves, a side-vehicle model has to be analyzed. 
Within it, the vehicle rotates around a Pitch Center point (PC), which is not at the same position as the CG.

<div align="center">
<img src="../../assets/images/vmp/side_car.png" alt="side_car" width=600>
</div>

As it can be seen at the image, the analysis is carried out by comparing the equations for *M<sub>y</sub>* resultant of the top and the bottom forces.
By doing so, the following is the equation for a side-car, at this case, the left side of the vehicle.
At it is also taking the approximation of *tan(&alpha;) &cong; &alpha;* for very small angles.

*(I<sub>y</sub> + m<sub>s</sub> &sdot; d<sub>pitch</sub><sup>2</sup>) &sdot; d<sup>2</sup>/dt<sup>2</sup> &sdot; &phi; = <br />
&emsp; (F<sub>x1</sub> + F<sub>x3</sub>) &sdot; h<sub>PC</sub> - 
F<sub>c1</sub> &sdot; l<sub>f</sub> + F<sub>c3</sub> &sdot; l<sub>r</sub> + 
m<sub>s</sub> &sdot; a<sub>x</sub> &sdot; d<sub>pitch</sub> +
m<sub>s</sub> &sdot; g &sdot; d<sub>pitch</sub> &sdot; &phi;*

With that analysis it is obtained the equation for half vehicle. 
The advantage for the pitch, as mentioned when the CG's position was being defined, is that the vehicle is simetric at that axis.
For it, the full equation, considering both sides of the vehicle, is the following:

*(I<sub>y</sub> + m<sub>s</sub> &sdot; d<sub>pitch</sub><sup>2</sup>) &sdot; d<sup>2</sup>/dt<sup>2</sup> &sdot; &phi; = <br />
&emsp; &sum; F<sub>x</sub> &sdot; h<sub>PC</sub> - 
(F<sub>c1</sub> + F<sub>c2</sub>) &sdot; l<sub>f</sub> + 
(F<sub>c3</sub> + F<sub>c4</sub>) &sdot; l<sub>r</sub> + 
m<sub>s</sub> &sdot; a<sub>x</sub> &sdot; d<sub>pitch</sub> +
m<sub>s</sub> &sdot; g &sdot; d<sub>pitch</sub> &sdot; &phi;*

### Roll-model
The definition of the roll-model follows the same guidelines as the pitch model.
However, the vehicle does not have the same symmetrical properties for the front and the back.
This affects to:
  - The front and rear mass 
  - The dampers characteristics
  - The distance to the Roll Center (RC), due its axis is tilted and not parallel to the ground

<div align="center">
<img src="../../assets/images/vmp/front_car.png" alt="front_car" width=550>
</div>

To simplify the calculus, the only approximation to be made is to consider that RC is in fact at the same distance.
In other words, it will be supposed that the axis that holds RC is parallel to the ground.
With it and following the previous analysis steps, the equation for the variation of the roll can be obtained as:

*(I<sub>x</sub> + m<sub>s</sub> &sdot; d<sub>roll</sub><sup>2</sup>) &sdot; d<sup>2</sup>/dt<sup>2</sup> &sdot; &theta; = <br />
&emsp; &sum; F<sub>y</sub> &sdot; h<sub>RC</sub> + 
(F<sub>c1</sub> - F<sub>c2</sub>) &sdot; t<sub>f</sub> /2 + 
(F<sub>c3</sub> - F<sub>c4</sub>) &sdot; t<sub>r</sub> /2 + 
m<sub>s</sub> &sdot; a<sub>y</sub> &sdot; d<sub>roll</sub> +
m<sub>s</sub> &sdot; g &sdot; d<sub>roll</sub> &sdot; &theta;*
