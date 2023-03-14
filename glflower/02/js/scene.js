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

        if (true)
        {
            let stem = new Stem(this.gl);
            stem.x = 0;
            stem.y = 0;
            stem.z = -100;
            // this.children.push(stem);    
        }

        if (true)
        {
            let parent = new Leaf(this.gl);
            parent.x = 0; // (Math.floor(i / 5) * 20) - 200;
            parent.y = -15;
            parent.z = -50.0;
    
            this.children.push(parent);
    
            /*
            let leaf;
            for (let i=0; i < 10; i++)
            {
                leaf = new Leaf(this.gl);
                leaf.y = 30;
                parent.addChild(leaf);
    
                parent = leaf;
            }
            */
    
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
        });    
    }

}