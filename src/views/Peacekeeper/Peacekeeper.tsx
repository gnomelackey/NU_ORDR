import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Tooltip } from "../../components/Tooltip";
import "./peacekeeper.css";

type Specialization = {
  name: string;
  perks: string[];
};

type PeacekeeperProfile = {
  specialization: Specialization | null;
  abilities: Record<string, number>;
  commonGear: string[];
  dutyBelt: string;
  d3m1Module: string;
  helmetUpgrade: string;
  extraGearRoll?: { table: string; result: string };
  hp: number;
  creds: number;
  height: string;
  weight: number;
  generations: number;
  relationships: number;
  familyBackground: string;
  signatureWord: string;
};

const commonGear = [
  "Standard Issued Baton (Thumper): Melee club (d4)",
  "Duty Belt: Holds all additional gear",
  "Data Gauntlet: Direct access to Five databanks",
  "Magnetic Cuffs: Restraints",
  "Flashlight: High-powered LED",
  "Keeper Badge: Grants authority",
  "Chrono Shifter: Enables Chrono Shift",
  "D3M1 Armor: -d4 damage",
  "GU4D Helmet: -1 damage, syncs with Data Gauntlet",
  "3X3-CU73 (3X3) Handgun: d6, 18 round clip, omni-clip",
  "+2 Omni-Clips",
];

const dutyBeltTable = [
  "Knock Knock Puck: breach doors or thin walls",
  "Smoke Grenade: smoke wall, -4 DR to defense inside",
  "Slammer Disk: 5x gravity, prone, immobilized d4 rounds",
  "Rootkit: ability to hack",
  "Tear Gas Grenade: +2 DR penalty inside cloud",
  "Taser Baton (d4): replaces Thumper; max damage → Toughness DR12 or lose next turn",
];

const d3m1ModuleTable = [
  "7UR713 [Activated]: -d6 damage reduction",
  "K1N37C [Immediate]: build kinetic energy; release to reduce breach tests or push targets",
  "M3D1C [Immediate]: heal d6 HP and gain 1 adrenaline",
  "C4M0 [Activated]: invisible when stationary; otherwise -2 DR to defense",
  "73MP [Activated]: temperature regulated, invisible to machines/sensors",
  "47HL37 [Activated]: reinforced joints; -4 DR on run/jump/swim/climb",
];

const helmetUpgradeTable = [
  "Omni-Optics: thermal, night, infrared vision",
  "Haste Chipset: cannot be surprised",
  "Hazard Haptics: -2 DR on physical tests while in pursuit",
  "Rebreather: filters toxins",
  "Voice of the Law: -2 DR on persuasion/intimidation",
  "Hammerhead: -2 DR to breaching",
];

const specializations: Specialization[] = [
  {
    name: "Demolition",
    perks: [
      "Explosive Expertise: -4 DR on explosive rolls; can craft improvised explosives (2d6)",
      "Bomb Squad: Start with Shock & Awe + Boom Tube upgrades",
      "Devil's Teeth: Explosives add d6 shrapnel damage",
    ],
  },
  {
    name: "Marksman",
    perks: [
      "Sniper: -4 DR on anchored skill shots",
      "Bullseye: Start with Long Shot + Ricoshot upgrades",
      "Huntsman: Mark target; hits +1 damage and -1 DR to skill shots",
    ],
  },
  {
    name: "Psionic",
    perks: [
      "Surface Dweller: read surface thoughts; Presence DR10",
      "Mutey: random psionic ability; Surface Dweller d4/day; helmet discomfort",
      "Mind Reader: extract info; Presence DR10, +2 DR per extra question",
    ],
  },
  {
    name: "Gearhead",
    perks: [
      "Schematic Junky: operate 2 additional vehicles",
      "Obsession: upgraded bike; roll twice to attack assailant",
      "Can’t Shake Me: superior pursuit handling on bike",
    ],
  },
  {
    name: "Hacker",
    perks: [
      "Spitting Bits: hack without rootkit; roll on hacking tool table",
      "Gate Breaker: start hacks with successes based on matrix size",
      "4553-MBLY (Membly): remote hacking/spy bot",
    ],
  },
  {
    name: "Tank",
    perks: [
      "Giant Born: +1m height, +50kg, double carry + HP",
      "Adrenaline Junky: adrenaline on damage; death roll after combat",
      "Juggernaut: breach by taking d4 damage; surprise round first turn",
    ],
  },
];

const familyBackgrounds = [
  "Janitors",
  "Smugglers ::rehabilitated::",
  "Accountants",
  "Bankers",
  "Programmers",
  "Fast Food Cooks",
  "Drug Lords ::rehabilitated::",
  "Lawyers ::rehabilitated::",
  "Reporters",
  "Writers",
  "Artists",
  "Farmers",
  "Salvagers",
  "Cybersecurity",
  "Factory workers",
  "Hitmen ::rehabilitated::",
  "Security Guards",
  "Hackers ::rehabilitated::",
  "Sewage maintenance",
  "Construction",
];

const rehabTag = "::rehabilitated::";

const signatureWords = [
  "Overzealous",
  "Ruthless",
  "Strict",
  "Disciplined",
  "Tactical",
  "Loyal",
  "Resilient",
  "Fearless",
  "Vigilant",
  "Stoic",
  "Skilled",
  "Decisive",
  "Shrewd",
  "Patriotic",
  "Intelligent",
  "Imposing",
  "Dogmatic",
  "Incorruptible",
  "Cynical",
  "Exacting",
];

const moduleLabel = (entry: string) => {
  const match = entry.match(/^(.*)\s\[(Immediate|Activated)\]:\s?(.*)$/);
  if (!match) {
    return { name: entry, mode: "", description: "" };
  }
  return {
    name: match[1].trim(),
    mode: match[2],
    description: match[3].trim(),
  };
};

const abilityList = [
  "Strength",
  "Agility",
  "Presence",
  "Toughness",
  "Knowledge",
];

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1;
const rollD4MinusD4 = () => rollDie(4) - rollDie(4);

const pick = <T,>(list: T[]) => list[rollDie(list.length) - 1];

const rollAbility = () => rollD4MinusD4();

export function Peacekeeper() {
  const [profile, setProfile] = useState<PeacekeeperProfile | null>(null);

  const generatePeacekeeper = () => {
    const rollSpecialization =
      Math.random() < 0.15 ? null : pick(specializations);

    const abilities: Record<string, number> = {};
    abilityList.forEach((ability) => {
      const first = rollAbility();
      if (!rollSpecialization) {
        const second = rollAbility();
        abilities[ability] = Math.max(first, second);
      } else {
        abilities[ability] = first;
      }
    });

    let extraGearRoll: PeacekeeperProfile["extraGearRoll"] = undefined;
    if (!rollSpecialization) {
      const abilityKeys = [...abilityList];
      const first = pick(abilityKeys);
      abilityKeys.splice(abilityKeys.indexOf(first), 1);
      const second = pick(abilityKeys);
      abilities[first] += 2;
      abilities[second] += 2;

      const tables = [
        { name: "Duty Belt", list: dutyBeltTable },
        { name: "D3M1 Module", list: d3m1ModuleTable },
        { name: "Helmet Upgrade", list: helmetUpgradeTable },
      ];
      const chosen = pick(tables);
      extraGearRoll = { table: chosen.name, result: pick(chosen.list) };
    }

    const dutyBelt = pick(dutyBeltTable);
    const d3m1Module = pick(d3m1ModuleTable);
    const helmetUpgrade = pick(helmetUpgradeTable);

    const toughness = abilities.Toughness ?? 0;
    const hp = toughness + rollDie(8);
    const creds = (rollDie(6) + rollDie(6)) * 10;

    const feet = rollDie(2) + 5;
    const inchesRoll = rollDie(12);
    const extraFoot = inchesRoll === 12 ? 1 : 0;
    const inches = inchesRoll === 12 ? 0 : inchesRoll;
    const height = `${feet + extraFoot}'${String(inches).padStart(2, "0")}"`;

    const weight = rollDie(100) + 180;
    const generations = rollDie(10) - 1;
    const relationships = Math.floor(generations / 3);

    setProfile({
      specialization: rollSpecialization,
      abilities,
      commonGear,
      dutyBelt,
      d3m1Module,
      helmetUpgrade,
      extraGearRoll,
      hp,
      creds,
      height,
      weight,
      generations,
      relationships,
      familyBackground: pick(familyBackgrounds),
      signatureWord: pick(signatureWords),
    });
  };

  useEffect(() => {
    if (!profile) {
      generatePeacekeeper();
    }
  }, [profile]);

  const abilityEntries = useMemo(() => {
    if (!profile) return [];
    return abilityList.map((ability) => ({
      name: ability,
      value: profile.abilities[ability] ?? 0,
    }));
  }, [profile]);

  return (
    <section className="page peacekeeper-page">
      <div className="page-header">
        <div className="hero-actions">
          <p className="eyebrow">Peacekeeper Creation</p>
          <Button onClick={generatePeacekeeper}>Generate Peacekeeper</Button>
        </div>
        <p className="page-description">
          One click. One Peacekeeper. Full kit, specialization, and background
          resolved by the Supreme Court's randomizer.
        </p>
      </div>

      {!profile ? (
        <div className="panel scanline-card">
          <h2>Awaiting Induction</h2>
          <p className="lede">
            Press generate to receive a full Peacekeeper dossier including gear,
            specialization, and personal profile.
          </p>
        </div>
      ) : (
        <div className="peacekeeper-grid">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div className="panel scanline-card peacekeeper-panel">
              <span className="badge-label">Specialization</span>
              <h2>{profile.specialization?.name ?? "Unassigned"}</h2>
              <p className="lede">
                {profile.specialization
                  ? "Keeper specialization active. Cadet perk not listed in provided rules."
                  : "No specialization. Ability bonuses applied + extra gear roll."}
              </p>
              <ul className="rule-list">
                {(
                  profile.specialization?.perks ?? [
                    "+2 to two ability scores",
                    "Roll twice for each ability and keep the higher",
                    profile.extraGearRoll
                      ? `Extra gear roll: ${profile.extraGearRoll.table}`
                      : "",
                  ]
                )
                  .filter(Boolean)
                  .map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
              </ul>

              <div className="status-grid">
                {abilityEntries.map((ability) => (
                  <div key={ability.name}>
                    <span className="status-label">{ability.name}</span>
                    <span className="status-value">{ability.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel peacekeeper-panel">
              <div
                className="panel-content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h2>Personal Touches</h2>
                <div className="callout">
                  <span>HP</span>
                  <strong>{profile.hp}</strong>
                </div>
                <div className="callout">
                  <span>Height / Weight</span>
                  <strong>
                    {profile.height} / {profile.weight} lbs
                  </strong>
                </div>
                <div className="callout">
                  <span>Cred Account</span>
                  <strong>{profile.creds}¤</strong>
                </div>
                <div className="badge-stack">
                <div className="badge badge--compact">
                  <div className="badge-header-row">
                    <span className="badge-label">Family Legacy</span>
                    <Tooltip content="Number of Relationships">
                      <span className="relationship-row">
                        {profile.relationships}
                        <span className="relationship-icon" aria-hidden="true">
                          <img src="/relationship.svg" alt="" />
                        </span>
                      </span>
                    </Tooltip>
                  </div>
                  <p>
                    {profile.generations === 0
                      ? "First generation Keeper"
                      : `${profile.generations} generations of Keepers`}
                  </p>
                </div>
                  <div className="badge badge--compact badge--rehab">
                    <span className="badge-label">Family Occupation</span>
                    {profile.familyBackground.includes(rehabTag) ? (
                      <span className="rehab-chip">Rehabilitated</span>
                    ) : null}
                    <p>
                      {profile.familyBackground.replace(rehabTag, "").trim()}
                    </p>
                  </div>
                  <div className="badge badge--compact">
                    <span className="badge-label">Best Fit Word</span>
                    <p>{profile.signatureWord}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="panel peacekeeper-panel">
            <div className="panel-content">
              <h2>Gear Loadout</h2>
              <div className="tool-grid">
                <div className="tool-card">
                  <span className="badge-label full-width">Duty Belt (d6)</span>
                  <p>{profile.dutyBelt}</p>
                </div>
                <div className="tool-card">
                  <span className="badge-label full-width">D3M1 Module (d6)</span>
                  {(() => {
                    const module = moduleLabel(profile.d3m1Module);
                    if (!module.mode) {
                      return <p>{profile.d3m1Module}</p>;
                    }
                    return (
                      <>
                        <div className="module-title-row">
                          <p>{module.name}</p>
                          <span className="module-pill">{module.mode}</span>
                        </div>
                        <p>{module.description}</p>
                      </>
                    );
                  })()}
                </div>
                <div className="tool-card">
                  <span className="badge-label full-width">Helmet Upgrade (d6)</span>
                  <p>{profile.helmetUpgrade}</p>
                </div>
                {profile.extraGearRoll ? (
                  <div className="tool-card">
                    <span className="badge-label full-width">Extra Roll</span>
                    <p>
                      {profile.extraGearRoll.table}:{" "}
                      {profile.extraGearRoll.result}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="gear-section">
                <span className="badge-label">Common Gear (Auto)</span>
                <ul className="rule-list">
                  {profile.commonGear.map((gear) => (
                    <li key={gear}>{gear}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="peacekeeper-footer">
        <a
          href="https://www.flaticon.com/free-icons/identity"
          title="identity icons"
          target="_blank"
          rel="noreferrer"
        >
          Identity icons created by meaicon - Flaticon
        </a>
      </footer>
    </section>
  );
}
