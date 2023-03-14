class Scene
{
    constructor(canvasEl)
    {
        this.canvas = document.getElementById(canvasEl);
        this.gl = this.canvas.getContext("webgl");

        this.canvas.onmouseover = this.stopAnim.bind(this);
        this.canvas.onmouseout = this.startAnim.bind(this);
        this.canvas.onmousemove = this.mousemove.bind(this);

        this.bounds = this.canvas.getBoundingClientRect();
        console.log(this.bounds);
        
        if (this.gl === null)
        {
            alert("WebGL not available");
        }

        this._lastUpdate = -1;

        this.children = [];

        if (false)
        {
            let cyl = new Cylinder(this.gl, {});
            cyl.z = -100;

            // this.children.push(cyl);
        }


        if (false)
        {
            this.plant = new Stem(this.gl);
            this.plant.x = 0;
            this.plant.y = -30;
            this.plant.z = -80;
            // this.children.push(this.plant);    
        }

        if (true)
        {
            /*
            this.plant = new Petal(this.gl);
            this.plant.x = 0; // (Math.floor(i / 5) * 20) - 200;
            this.plant.y = -2;
            this.plant.z = -20.0;   
            this.children.push(this.plant);
            */

            let p;
            for (let i=0; i < 20; i++)
            {
                if (i >= 10)
                {
                    p = new Petal(this.gl);
                }
                else
                {
                    p = new Leaf(this.gl);
                }
                p.x = ((i % 5) * 10) - 20;
                p.y = Math.floor(i/5) * 10 - 15;
                p.z = -60.0;
                this.children.push(p);
                this.plant = p;
            }
        }

        this.animating = true;
        this.update(0);
    }

    startAnim()
    {
        this.animating = true;
    }

    stopAnim()
    {
        this.animating = false;
    }

    mousemove(evt)
    {    
        let y = ((evt.clientX - this.bounds.x) / this.bounds.width);
        y = (y - 0.5) * 360;

        // this.plant.rotationY = y;
        this.children.forEach(c => {
            c.rotationY = y;
        })
    }

    update(totalTime)
    {
        let deltaTime = 0;
        if( this._lastUpdate != -1 )
        {
            deltaTime = totalTime - this._lastUpdate;
        }
        this._lastUpdate = totalTime;

        if( deltaTime === deltaTime )
        {
            this.children.forEach( e =>
            {
                e.update( deltaTime );
            } );
        }

        if (this.animating)
        {
            // this.plant.rotateY(deltaTime * 0.1);
            this.children.forEach(c => {
                c.rotateY(deltaTime * 0.1);
            });
        
        }
        
        this.drawScene();
        requestAnimationFrame(this.update.bind(this));
    }

    drawScene()
    {
        let gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        // gl.enable(gl.CULL_FACE);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 1000.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);
            
        this.children.forEach(c => {
            c.draw(projectionMatrix);
        });    
    }

}