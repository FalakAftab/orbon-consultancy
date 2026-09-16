/**
 * Dark navy contextual tip panel shown alongside the wizard form.
 * Content changes per step, matching the product design's
 * "Did you know? / Intake Deadlines / Language Rules / Blocked Account /
 * Instant Matching" sidebar cards.
 */
const TIPS = {
  1: {
    title: 'Did you know?',
    body:
      'German universities have strict credit requirements. Having a degree with sufficient credits in your subject area is crucial for admission to German Master\u2019s programs.',
    image: '/images/universities/campus-lmu.jpg',
  },
  2: {
    title: 'Language Rules',
    body:
      'Even if your course is entirely in English, basic German skills (A1/A2) are highly recommended for daily life and may be required for visa registration.',
    image: '/images/universities/campus-tum.jpg',
  },
  3: {
    title: 'Degree & Discipline',
    body:
      'Selecting your target degree and primary discipline sets the foundation. German universities evaluate consecutive study backgrounds strictly.',
    image: '/images/universities/campus-heidelberg.jpg',
  },
  4: {
    title: 'Specializations',
    body:
      'Selecting specific subcategories refines your recommendations. You can also pick "All" to broaden your matching scope across the entire academic field.',
    image: '/images/universities/campus-humboldt.jpg',
  },
  5: {
    title: 'Intake & Deadlines',
    body:
      'Most English-taught Master\u2019s programs start in the Winter semester. Application portals usually close between April 15 and July 15. Planning ahead is key.',
    image: '/images/universities/campus-rwth.jpg',
  },
  6: {
    title: 'Instant Matching',
    body:
      'Clicking submit evaluates your GPA scale equivalents (via Bavarian Formula), language levels, and subject eligibility against the live dataset.',
    image: '/images/contact_hero.jpg',
  },
};

export function WizardTipPanel({ step }) {
  const tip = TIPS[step] || TIPS[1];

  return (
    <aside className="wizard-tip-panel">
      <h3 className="wizard-tip-title">{tip.title}</h3>
      <p className="wizard-tip-body">{tip.body}</p>
      <div className="wizard-tip-photo">
        <img src={tip.image} alt="" />
      </div>
    </aside>
  );
}

export default WizardTipPanel;
