class RoleplayUI extends ImageGeneratorInputGroup
{
  constructor(imgGen, parentEl)
  {
    super(imgGen, parentEl);

    this.addTextOption('title', 'titleTxt', 'Module Name');
  }
}



class RoleplayBook extends CubocoImgGen
{
  constructor(imgEl, controlsEl, options)
  {
    super(imgEl, options);

    this.ui = new RoleplayUI(this, controlsEl);

  }

  render(ctx)
  {

  }
}
