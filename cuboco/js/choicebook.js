class ChoiceBookUI extends CubocoImageGeneratorUI
{
  init()
  {
    this.addTextOption('Title Text', 'titleTxt', '');
  }
}

class ChoiceBook extends CubocoImgGen
{
  init()
  {
    this.ui = new ChoiceBookUI(this);

    this.baseWidth = 980;
    this.baseHeight = 1600;

    // this.mainImgW = (this.imgWidth - this.hVal(160));
    // this.mainImgH = this.vVal(560);

    this.data = {
      titleText: "THE CAVE OF TIME",
      seriesText: "CHOOSE YOUR OWN ADVENTURE #1",
      subtitleText: "YOU'RE THE STAR OF THE STORY!\nCHOOSE FROM 40 POSSIBLE ENDINGS",
      authorText: "BY EDWARD PACKARD",
      illustratorText: "ILLUSTRATED BY PAUL GRANGER",
      colorOuter: '#0000FF',
      colorInner: '#FF0000',
    }


  }

  render()
  {

  }


}
