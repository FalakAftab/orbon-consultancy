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
    image: '/assets/wizard/step-photo.jpg',
  },
  2: {
    title: 'Language Rules',
    body:
      'Even if your course is entirely in English, basic German skills (A1/A2) are highly recommended for daily life and may be required for visa registration.',
    image: '/assets/wizard/step-photo.jpg',
  },
  3: {
    title: 'Intake Deadlines',
    body:
      'Most English-taught Master\u2019s programs start in the Winter semester. Application portals usually close between April 15 and July 15. Planning ahead is key to securing a spot.',
    image: '/assets/wizard/step-photo.jpg',
  },
  4: {
    title: 'Blocked Account',
    body:
      'To acquire a German student visa, you must provide proof of financial resources. The required blocked account amount is reviewed annually — budget realistically for living costs.',
    image: '/assets/wizard/step-photo.jpg',
  },
  5: {
    title: 'Instant Matching',
    body:
      'Clicking submit evaluates your specific credit hours, GPA scale equivalents (via the Bavarian Formula), and language levels to output real, verified matches.',
    image: '/assets/wizard/step-photo.jpg',
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
