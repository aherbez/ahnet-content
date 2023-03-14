class Petal extends ComplexCurveModel
{
    constructor(gl, seed)
    {
        super(gl, seed);
    }

    animate(dt)
    {
        // this.rotateY(dt * 0.1);
    }
    
    initShaders()
    {
        super.initShaders();

        this.fsShaderSource = `
            varying highp vec2 vTextureCoord;
            varying highp vec3 vLighting;
            varying highp vec3 vNormal;
            highp vec2 newTex;

            uniform sampler2D uSampler;

            void main() {
                // newTex = vec2(vTextureCoord);
                // gl_FragColor = vec4(0.2, vTextureCoord[0]-0.5, (1.0-vTextureCoord[0]) * 0.2, 1.0);
                // gl_FragColor = vec4(vNormal, 1);
                // gl_FragColor = vec4(0.0, 1., 0., 1.);
                
                highp vec3 color = vec3(1, 1., 0.1);
                
                gl_FragColor = vec4(vNormal, 1.0);
                // gl_FragColor = vec4(color * vLighting, 1.0);

                if (gl_FrontFacing) {
                    gl_FragColor = vec4(vTextureCoord[0], 0., 0., 1.);
                }
            }
        `;         
    }
    
    setDimensions()
    {
        super.setDimensions();

        this.divsX = 8;
        this.divsY = 20;
    }

    _makeBaseCurves()
    {
        let r = this.rand;
        this.midPoint = r.random() * 0.5 + 0.25;
        let botMid = r.random() * (this.midPoint * 0.5) + (this.midPoint * 0.25);
        let topMid = r.random() * ((1-this.midPoint) * 0.5) + ((1-this.midPoint) * 0.25);
        topMid += this.midPoint;

        let points = [];
        points[0] = new Point(0, 0);

        // points[1] = new Point(0, botMid);
        points[1] = new Point(1, 0);
        points[2] = new Point(1, botMid);
        
        points[3] = new Point(1, this.midPoint);

        points[4] = new Point(1, topMid);
        points[5] = new Point(0, topMid);

        points[6] = new Point(0, 1);

        // xz curve is a combination of two 
        this.botCurve = new bzCurveCubic(points[0], points[1], points[2], points[3]);
        this.topCurve = new bzCurveCubic(points[3], points[4], points[5], points[6]);


        this.xzCurve = new bzCurveQuad(
            new Point(0, 0),
            new Point(1, 0),
            new Point(1, 1)
        );
        
        this.yzCurve = new bzCurveQuad(
            new Point(0, 0),
            new Point(1, 0),
            new Point(1, 1)
        );
    }

}