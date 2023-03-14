class Scene
{
    constructor(canvasEl)
    {
        this.canvas = document.getElementById(canvasEl);
        this.gl = this.canvas.getContext("webgl");

        if (this.gl === null)
        {
            alert("WebGL not available");
        }

        this._lastUpdate = -1;

        this.children = [];

        let leaf;
        for (let i=0; i < 100; i++)
        {
            leaf = new Petal(this.gl);
            leaf.x = (Math.floor(i / 5) * 20) - 200;
            leaf.y = (i % 5) * 20 -20;
            leaf.z = -300.0;

            this.children.push(leaf);
        }

        this.update(0);
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
        })    
    }

}