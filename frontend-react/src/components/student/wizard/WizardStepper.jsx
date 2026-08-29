import { Check } from 'lucide-react';

/**
 * Horizontal numbered stepper for the Recommendation Wizard.
 * Replaces the old thin progress bar with the numbered-circle +
 * connecting-line pattern from the product design.
 */
export function WizardStepper({ steps, currentStep }) {
  return (
    <div className="wizard-stepper-wrapper">
      {/* Mobile Active Step Indicator Pill */}
      <div className="wizard-stepper-mobile-pill">
        <span className="wizard-stepper-mobile-badge">Step {currentStep} of {steps.length}</span>
        <span className="wizard-stepper-mobile-title">{steps[currentStep - 1]?.title}</span>
      </div>

      <div className="wizard-stepper" role="list" aria-label="Wizard progress">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const state =
            stepNumber < currentStep ? 'done' : stepNumber === currentStep ? 'active' : 'upcoming';

          return (
            <div className="wizard-stepper-item" key={step.id} role="listitem">
              <div className={`wizard-stepper-node wizard-stepper-node--${state}`}>
                {state === 'done' ? <Check size={14} /> : stepNumber}
              </div>
              <span className={`wizard-stepper-label wizard-stepper-label--${state}`}>
                {step.title}
              </span>
              {stepNumber < steps.length && (
                <span className={`wizard-stepper-line wizard-stepper-line--${state === 'done' ? 'done' : 'upcoming'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WizardStepper;
