import { useState } from 'react';
import type { ReactNode } from 'react';
import './App.css';

function App() {
  return (
    <main className="space-app">
      <div className="space-layer space-layer-stars" aria-hidden="true" />
      <div className="space-layer space-layer-nebula" aria-hidden="true" />

      <div className="space-content">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Astrophysics / Space Lab</p>
            <h1>Astrophysics Solver</h1>
            <p className="hero-text">
              A cinematic calculator deck for black holes, stellar light, orbits, and cosmology.
              Each card explains the equation in beginner-friendly language while showing a live answer.
            </p>

            <div className="hero-stats">
              <article>
                <span>9</span>
                <p>equations across gravity, radiation, and expansion</p>
              </article>
              <article>
                <span>Live</span>
                <p>results update as you change the input values</p>
              </article>
              <article>
                <span>Guide</span>
                <p>plain-language notes help beginners read the symbols</p>
              </article>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit-scene" aria-hidden="true">
              <div className="orbit-ring orbit-ring-large" />
              <div className="orbit-ring orbit-ring-medium" />
              <div className="orbit-ring orbit-ring-small" />
              <div className="orbit-core" />
              <div className="orbit-satellite orbit-satellite-one" />
              <div className="orbit-satellite orbit-satellite-two" />
              <div className="orbit-satellite orbit-satellite-three" />
            </div>

            <aside className="mission-panel">
              <p className="mission-label">Mission control</p>
              <ul>
                <li>Black hole mass and Schwarzschild radius</li>
                <li>Stars, temperature, flux, and wavelength</li>
                <li>Distances from parallax and Hubble&apos;s law</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="section-heading">
          <div>
            <p className="section-kicker">Calculator deck</p>
            <h2>Choose an equation</h2>
          </div>
          <p>Every panel includes a short explanation so the math feels easier to read.</p>
        </section>

        <section className="calculator-grid">
          <SchwarzschildCard />
          <NewtonCard />
          <OrbitCard />
          <FluxCard />
          <StefanBoltzmannCard />
          <WienCard />
          <ParallaxCard />
          <HubbleCard />
          <EinsteinCard />
          <FriedmannCard />
        </section>
      </div>
    </main>
  );
}

type CalculatorCardProps = {
  category: string;
  title: string;
  equation: string;
  description: string;
  variables: Array<{ symbol: string; meaning: string }>;
  resultLabel: string;
  resultUnit: string;
  result: number | null;
  tone: string;
  children: ReactNode;
};

function CalculatorCard({
  category,
  title,
  equation,
  description,
  variables,
  resultLabel,
  resultUnit,
  result,
  tone,
  children,
}: CalculatorCardProps) {
  return (
    <article className={`calc-card ${tone}`}>
      <p className="card-category">{category}</p>
      <h3>{title}</h3>
      <p className="equation">{equation}</p>
      <p className="card-description">{description}</p>

      <div className="variable-list">
        <p className="variable-list-title">Variables</p>
        <ul>
          {variables.map((variable) => (
            <li key={variable.symbol}>
              <strong>{variable.symbol}</strong>
              <span>{variable.meaning}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-stack">{children}</div>

      {result !== null ? (
        <div className="result-panel">
          <span>{resultLabel}</span>
          <strong>{formatMeasurement(result, resultUnit)}</strong>
        </div>
      ) : (
        <div className="result-panel result-panel-muted">
          <span>{resultLabel}</span>
          <strong>Enter valid values to see the result.</strong>
        </div>
      )}
    </article>
  );
}

type NumberFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function NumberField({ label, placeholder, value, onChange }: NumberFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="field-input"
        type="number"
        step="any"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function parseInput(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatMeasurement(value: number, unit: string): string {
  const absoluteValue = Math.abs(value);
  const formattedValue =
    absoluteValue !== 0 && (absoluteValue >= 1_000_000 || absoluteValue < 0.001)
      ? value.toExponential(6)
      : value.toLocaleString('en-GB', { maximumFractionDigits: 6 });

  return unit ? `${formattedValue} ${unit}` : formattedValue;
}

function SchwarzschildCard() {
  const [massInput, setMassInput] = useState('5.972e24');
  const mass = parseInput(massInput);
  const radius = mass !== null && mass >= 0 ? calculateSchwarzschildRadius(mass) : null;

  return (
    <CalculatorCard
      category="Compact objects"
      title="Schwarzschild radius"
      equation="r = 2GM / c²"
      description="This estimates the radius where an object would become a black hole if all its mass were compressed into a sphere."
      variables={[
        { symbol: 'r', meaning: 'the Schwarzschild radius, or the black hole boundary radius' },
        { symbol: 'G', meaning: 'the gravitational constant' },
        { symbol: 'M', meaning: 'the mass of the object' },
        { symbol: 'c', meaning: 'the speed of light' },
      ]}
      resultLabel="Schwarzschild radius"
      resultUnit="millimetres"
      result={radius}
      tone="tone-cyan"
    >
      <NumberField
        label="Mass of the object (kilograms)"
        placeholder="e.g. 5.972e24 for Earth"
        value={massInput}
        onChange={setMassInput}
      />
    </CalculatorCard>
  );
}

function NewtonCard() {
  const [massOneInput, setMassOneInput] = useState('5.972e24');
  const [massTwoInput, setMassTwoInput] = useState('7.348e22');
  const [distanceInput, setDistanceInput] = useState('3.844e8');

  const massOne = parseInput(massOneInput);
  const massTwo = parseInput(massTwoInput);
  const distance = parseInput(distanceInput);
  const force =
    massOne !== null && massTwo !== null && distance !== null && distance > 0
      ? calculateGravitationalForce(massOne, massTwo, distance)
      : null;

  return (
    <CalculatorCard
      category="Gravity"
      title="Newton's law of universal gravitation"
      equation="F = G(m₁m₂) / r²"
      description="This gives the gravitational force between two masses, where m1 and m2 are the masses and r is the distance between their centers."
      variables={[
        { symbol: 'F', meaning: 'the gravitational force' },
        { symbol: 'G', meaning: 'the gravitational constant' },
        { symbol: 'm₁', meaning: 'mass of the first object' },
        { symbol: 'm₂', meaning: 'mass of the second object' },
        { symbol: 'r', meaning: 'distance between the centers of the two objects' },
      ]}
      resultLabel="Gravitational force"
      resultUnit="Newtons"
      result={force}
      tone="tone-violet"
    >
      <NumberField
        label="Mass 1 (kilograms)"
        placeholder="e.g. 5.972e24 for Earth"
        value={massOneInput}
        onChange={setMassOneInput}
      />
      <NumberField
        label="Mass 2 (kilograms)"
        placeholder="e.g. 7.348e22 for Moon"
        value={massTwoInput}
        onChange={setMassTwoInput}
      />
      <NumberField
        label="Distance between objects (meters)"
        placeholder="e.g. 3.844e8 for Earth-Moon distance"
        value={distanceInput}
        onChange={setDistanceInput}
      />
    </CalculatorCard>
  );
}

function OrbitCard() {
  const [massInput, setMassInput] = useState('5.972e24');
  const [radiusInput, setRadiusInput] = useState('6.771e6');

  const mass = parseInput(massInput);
  const radius = parseInput(radiusInput);
  const velocity =
    mass !== null && radius !== null && radius > 0
      ? calculateCircularOrbitVelocity(mass, radius)
      : null;

  return (
    <CalculatorCard
      category="Orbits"
      title="Circular orbit velocity"
      equation="v = √(GM / r)"
      description="This tells you how fast an object must move to stay in a circular orbit around a central mass at distance r."
      variables={[
        { symbol: 'v', meaning: 'the orbital velocity' },
        { symbol: 'G', meaning: 'the gravitational constant' },
        { symbol: 'M', meaning: 'the mass of the central object' },
        { symbol: 'r', meaning: 'the orbital radius, measured from the center of the mass' },
      ]}
      resultLabel="Circular orbit velocity"
      resultUnit="meters per second"
      result={velocity}
      tone="tone-gold"
    >
      <NumberField
        label="Central mass (kilograms)"
        placeholder="e.g. 5.972e24 for Earth"
        value={massInput}
        onChange={setMassInput}
      />
      <NumberField
        label="Orbit radius (meters)"
        placeholder="e.g. 6.771e6 for a low Earth orbit"
        value={radiusInput}
        onChange={setRadiusInput}
      />
    </CalculatorCard>
  );
}

function FluxCard() {
  const [luminosityInput, setLuminosityInput] = useState('3.828e26');
  const [distanceInput, setDistanceInput] = useState('1.496e11');

  const luminosity = parseInput(luminosityInput);
  const distance = parseInput(distanceInput);
  const flux = luminosity !== null && distance !== null && distance > 0 ? calculateFlux(luminosity, distance) : null;

  return (
    <CalculatorCard
      category="Radiation"
      title="Inverse square law for flux"
      equation="F = L / (4πr²)"
      description="This calculates the energy per square meter received from a light source at distance r, based on its total luminosity L."
      variables={[
        { symbol: 'F', meaning: 'the flux, or power per square meter' },
        { symbol: 'L', meaning: 'the total luminosity of the source' },
        { symbol: 'π', meaning: 'pi, a mathematical constant' },
        { symbol: 'r', meaning: 'distance from the source' },
      ]}
      resultLabel="Flux"
      resultUnit="watts per square meter"
      result={flux}
      tone="tone-pink"
    >
      <NumberField
        label="Luminosity of the source (watts)"
        placeholder="e.g. 3.828e26 for the Sun"
        value={luminosityInput}
        onChange={setLuminosityInput}
      />
      <NumberField
        label="Distance from the source (meters)"
        placeholder="e.g. 1.496e11 for Earth-Sun distance"
        value={distanceInput}
        onChange={setDistanceInput}
      />
    </CalculatorCard>
  );
}

function StefanBoltzmannCard() {
  const [temperatureInput, setTemperatureInput] = useState('5778');
  const temperature = parseInput(temperatureInput);
  const flux = temperature !== null && temperature > 0 ? calculateStefanBoltzmannLaw(temperature) : null;

  return (
    <CalculatorCard
      category="Radiation"
      title="Stefan-Boltzmann law"
      equation="F = σT⁴"
      description="This gives the power radiated per square meter by a black body from its temperature T."
      variables={[
        { symbol: 'F', meaning: 'the emitted flux' },
        { symbol: 'σ', meaning: 'the Stefan-Boltzmann constant' },
        { symbol: 'T', meaning: 'the absolute temperature in kelvin' },
      ]}
      resultLabel="Radiated flux"
      resultUnit="watts per square meter"
      result={flux}
      tone="tone-orange"
    >
      <NumberField
        label="Temperature of the source (kelvin)"
        placeholder="e.g. 5778 for the Sun"
        value={temperatureInput}
        onChange={setTemperatureInput}
      />
    </CalculatorCard>
  );
}

function WienCard() {
  const [temperatureInput, setTemperatureInput] = useState('5778');
  const temperature = parseInput(temperatureInput);
  const wavelength = temperature !== null && temperature > 0 ? calculateWiensDisplacementLaw(temperature) : null;

  return (
    <CalculatorCard
      category="Stellar light"
      title="Wien's displacement law"
      equation="λmax = b / T"
      description="This shows the wavelength where a hot object emits the most light, based on its temperature T."
      variables={[
        { symbol: 'λmax', meaning: 'the wavelength where emission is strongest' },
        { symbol: 'b', meaning: "Wien's displacement constant" },
        { symbol: 'T', meaning: 'the absolute temperature in kelvin' },
      ]}
      resultLabel="Peak wavelength"
      resultUnit="meters"
      result={wavelength}
      tone="tone-lime"
    >
      <NumberField
        label="Temperature of the source (kelvin)"
        placeholder="e.g. 5778 for the Sun"
        value={temperatureInput}
        onChange={setTemperatureInput}
      />
    </CalculatorCard>
  );
}

function ParallaxCard() {
  const [angleInput, setAngleInput] = useState('0.1');
  const angle = parseInput(angleInput);
  const distance = angle !== null && angle > 0 ? calculateStellarParallax(angle) : null;

  return (
    <CalculatorCard
      category="Distances"
      title="Stellar parallax"
      equation="d = 1 / p"
      description="This estimates the distance to a nearby star from its parallax angle p, which is the tiny shift seen as Earth moves around the Sun."
      variables={[
        { symbol: 'd', meaning: 'distance to the star in parsecs' },
        { symbol: 'p', meaning: 'the parallax angle in arcseconds' },
      ]}
      resultLabel="Distance"
      resultUnit="parsecs"
      result={distance}
      tone="tone-teal"
    >
      <NumberField
        label="Parallax angle (arcseconds)"
        placeholder="e.g. 0.1 for 10 parsecs"
        value={angleInput}
        onChange={setAngleInput}
      />
    </CalculatorCard>
  );
}

function HubbleCard() {
  const [velocityInput, setVelocityInput] = useState('70');
  const [hubbleConstantInput, setHubbleConstantInput] = useState('70');

  const velocity = parseInput(velocityInput);
  const hubbleConstant = parseInput(hubbleConstantInput);
  const distance =
    velocity !== null && hubbleConstant !== null && hubbleConstant > 0
      ? HubbleLaw(velocity, hubbleConstant)
      : null;

  return (
    <CalculatorCard
      category="Cosmology"
      title="Hubble's law"
      equation="d = v / H₀"
      description="This estimates how far away a galaxy is from its recession speed v and the Hubble constant H0."
      variables={[
        { symbol: 'd', meaning: 'distance to the galaxy in megaparsecs' },
        { symbol: 'v', meaning: 'recession velocity' },
        { symbol: 'H₀', meaning: 'the Hubble constant' },
      ]}
      resultLabel="Distance"
      resultUnit="megaparsecs"
      result={distance}
      tone="tone-sky"
    >
      <NumberField
        label="Recession velocity (km/s)"
        placeholder="e.g. 70"
        value={velocityInput}
        onChange={setVelocityInput}
      />
      <NumberField
        label="Hubble constant (km/s/Mpc)"
        placeholder="e.g. 70"
        value={hubbleConstantInput}
        onChange={setHubbleConstantInput}
      />
    </CalculatorCard>
  );
}

function EinsteinCard() {
  const [massInput, setMassInput] = useState('5.972e24');
  const [radiusInput, setRadiusInput] = useState('6.371e6');

  const mass = parseInput(massInput);
  const radius = parseInput(radiusInput);
  const curvature = mass !== null && radius !== null && radius > 0 ? EinsteinFieldEquations(mass, radius) : null;

  return (
    <CalculatorCard
      category="Relativity"
      title="Einstein field equations"
      equation="G_{μν} + Λg_{μν} = (8πG/c⁴)T_{μν}"
      description="This relates spacetime curvature to matter and energy; the equation says gravity is shaped by what is inside spacetime."
      variables={[
        { symbol: 'G_{μν}', meaning: 'the Einstein tensor, which describes spacetime curvature' },
        { symbol: 'Λ', meaning: 'the cosmological constant' },
        { symbol: 'g_{μν}', meaning: 'the metric tensor that describes spacetime geometry' },
        { symbol: 'G', meaning: 'the gravitational constant' },
        { symbol: 'c', meaning: 'the speed of light' },
        { symbol: 'T_{μν}', meaning: 'the stress-energy tensor, which describes matter and energy' },
      ]}
      resultLabel="Curvature value"
      resultUnit="arbitrary units"
      result={curvature}
      tone="tone-royal"
    >
      <NumberField
        label="Mass of the object (kilograms)"
        placeholder="e.g. 5.972e24 for Earth"
        value={massInput}
        onChange={setMassInput}
      />
      <NumberField
        label="Radius of the object (meters)"
        placeholder="e.g. 6.371e6 for Earth radius"
        value={radiusInput}
        onChange={setRadiusInput}
      />
    </CalculatorCard>
  );
}

function FriedmannCard() {
  const [massInput, setMassInput] = useState('5.972e24');
  const [radiusInput, setRadiusInput] = useState('6.371e6');

  const mass = parseInput(massInput);
  const radius = parseInput(radiusInput);
  const expansion = mass !== null && radius !== null && radius > 0 ? FriedmannEquations(mass, radius) : null;

  return (
    <CalculatorCard
      category="Cosmology"
      title="Friedmann equations"
      equation="(ȧ/a)² = (8πG/3)ρ - k/a² + Λ/3"
      description="This describes how the size of the universe changes over time, using its matter content, curvature, and dark energy term."
      variables={[
        { symbol: 'ȧ/a', meaning: 'the fractional expansion rate of the universe' },
        { symbol: 'G', meaning: 'the gravitational constant' },
        { symbol: 'ρ', meaning: 'the density of matter and energy' },
        { symbol: 'k', meaning: 'the spatial curvature term' },
        { symbol: 'a', meaning: 'the scale factor, which measures the size of the universe' },
        { symbol: 'Λ', meaning: 'the cosmological constant or dark energy term' },
      ]}
      resultLabel="Expansion value"
      resultUnit="arbitrary units"
      result={expansion}
      tone="tone-magenta"
    >
      <NumberField
        label="Mass of the object (kilograms)"
        placeholder="e.g. 5.972e24 for Earth"
        value={massInput}
        onChange={setMassInput}
      />
      <NumberField
        label="Radius of the object (meters)"
        placeholder="e.g. 6.371e6 for Earth radius"
        value={radiusInput}
        onChange={setRadiusInput}
      />
    </CalculatorCard>
  );
}

function calculateSchwarzschildRadius(kilograms: number): number {
  const gConstant = 6.674e-11;
  const lightSpeedSquared = 299_792_458 ** 2;
  return (kilograms * 2 * gConstant * 1000) / lightSpeedSquared;
}

function calculateGravitationalForce(massOne: number, massTwo: number, distance: number): number {
  const gConstant = 6.674e-11;
  return (gConstant * massOne * massTwo) / distance ** 2;
}

function calculateCircularOrbitVelocity(mass: number, radius: number): number {
  const gConstant = 6.674e-11;
  return Math.sqrt((gConstant * mass) / radius);
}

function calculateFlux(luminosity: number, distance: number): number {
  return luminosity / (4 * Math.PI * distance ** 2);
}

function calculateStefanBoltzmannLaw(temperature: number): number {
  const stefanBoltzmannConstant = 5.670374419e-8;
  return stefanBoltzmannConstant * temperature ** 4;
}

function calculateWiensDisplacementLaw(temperature: number): number {
  const wiensConstant = 2.897771955e-3;
  return wiensConstant / temperature;
}

function calculateStellarParallax(parallaxAngle: number): number {
  return 1 / parallaxAngle;
}

function HubbleLaw(velocity: number, hubbleConstant: number): number {
  return velocity / hubbleConstant;
}

function EinsteinFieldEquations(mass: number, radius: number): number {
  const gConstant = 6.674e-11;
  const c = 299_792_458;
  return (8 * Math.PI * gConstant * mass) / (c ** 4 * radius);
}

function FriedmannEquations(mass: number, radius: number): number {
  const gConstant = 6.674e-11;
  const c = 299_792_458;
  return (8 * Math.PI * gConstant * mass) / (3 * c ** 2 * radius ** 2);
}

export default App;
