import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { TestQuestionsProvider } from '../../providers/test-questions/test-questions';

@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  activeCardIndex: number;
  testQuestions: Array<Array<{question: string, answers:Array<{value: string, name: string}>}>>;
  testAnswers: Array<Array<{answer: any}>>;
  testProgress: number;
  nextButtonDisable: Array<string>;
  toast: any;
  questionsPageData: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private testService: TestQuestionsProvider, public toastCtrl: ToastController) {
    this.activeCardIndex = 0;
    this.testQuestions = this.testService.getQuestions();
    this.testProgress = 0;
    this.testAnswers = [];
    this.nextButtonDisable = [];
    this.updateQuestionsPageData();
  }

  answerSelect(index, subindex, answer) {
    this.updateTest(index, subindex, answer);
  }

  handleActiveIndex(move) {
    this.activeCardIndex += move;
    this.updateQuestionsPageData();
  }

  updateTest(index, subindex, answer) {
    if (!this.testAnswers[index]) {
      this.testAnswers[index] = [];
    }
    this.testAnswers[index][subindex] = answer.value;
    this.testProgress = this.updateProgress(this.testAnswers);
    this.nextButtonDisable[index] = (this.testAnswers[index].filter(val => val.toString() === "1").length > 2) ? "disabled" : "";

    if (this.nextButtonDisable[index] === "disabled" && !this.toast) {
      this.showToast();
    }

  }

  showToast() {
    this.toast = this.toastCtrl.create({
      message: 'Solo puedes elegir "Si" 2(dos) veces por pantalla',
      duration: 5000,
      position: 'middle',
      showCloseButton: true
    });
    this.toast.present();
    this.toast.onDidDismiss(() => {
      this.toast = null;
    });
  }

  updateProgress(values) {
    var merged = [].concat.apply([], values).filter(val => val);
    return (merged.length * 100) / this.testService.getTotalLength()
  }

  updateQuestionsPageData() {
    this.questionsPageData = "Pagina " + (this.activeCardIndex + 1) + " de " + this.testQuestions.length;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

}
