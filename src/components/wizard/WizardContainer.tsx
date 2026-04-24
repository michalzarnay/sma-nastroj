import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { StepNavigation } from '../layout/StepNavigation';
import { useWizard } from '../../hooks/useWizard';
import { useArealState } from '../../hooks/useArealState';
import { Step1_Uvod } from './Step1_Uvod';
import { Step2_Pozemky } from './Step2_Pozemky';
import { Step3_Budovy } from './Step3_Budovy';
import { Step4_IneStavby } from './Step4_IneStavby';
import { Step5_BGOpatrenia } from './Step5_BGOpatrenia';
import { Step6_Vysledky } from './Step6_Vysledky';
import { ChatPanel } from '../chat/ChatPanel';
import { SessionManager } from '../sessions/SessionManager';

export function WizardContainer() {
  const wizard = useWizard();
  const arealState = useArealState();

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return (
          <Step1_Uvod
            areal={arealState.areal}
            updateAreal={arealState.updateAreal}
            addMedia={arealState.addMedia}
            updateMedia={arealState.updateMedia}
            removeMedia={arealState.removeMedia}
          />
        );
      case 2:
        return (
          <Step2_Pozemky
            pozemky={arealState.areal.pozemky}
            addPozemok={arealState.addPozemok}
            updatePozemok={arealState.updatePozemok}
            removePozemok={arealState.removePozemok}
          />
        );
      case 3:
        return (
          <Step3_Budovy
            budovy={arealState.areal.budovy}
            addBudova={arealState.addBudova}
            updateBudova={arealState.updateBudova}
            removeBudova={arealState.removeBudova}
          />
        );
      case 4:
        return (
          <Step4_IneStavby
            ineStavby={arealState.areal.ineStavby}
            addInaStavba={arealState.addInaStavba}
            updateInaStavba={arealState.updateInaStavba}
            removeInaStavba={arealState.removeInaStavba}
          />
        );
      case 5:
        return (
          <Step5_BGOpatrenia
            bgOpatrenia={arealState.areal.bgOpatrenia}
            addBGOpatrenie={arealState.addBGOpatrenie}
            updateBGOpatrenie={arealState.updateBGOpatrenie}
            removeBGOpatrenie={arealState.removeBGOpatrenie}
          />
        );
      case 6:
        return (
          <Step6_Vysledky
            areal={arealState.areal}
            updateVahy={arealState.updateVahy}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        progress={wizard.progress}
        currentStep={wizard.currentStep}
        totalSteps={wizard.totalSteps}
        extraActions={
          <SessionManager
            areal={arealState.areal}
            onLoad={arealState.setAreal}
            onNew={arealState.resetAreal}
          />
        }
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          {renderStep()}
          {wizard.currentStep < 6 && (
            <StepNavigation
              currentStep={wizard.currentStep}
              totalSteps={wizard.totalSteps}
              onNext={wizard.nextStep}
              onPrev={wizard.prevStep}
              onGoTo={wizard.goToStep}
              visitedSteps={wizard.visitedSteps}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Chatbot asistent */}
      <ChatPanel areal={arealState.areal} currentStep={wizard.currentStep} />
    </div>
  );
}
