/**
 * Created by Jan Okraska in 2017
 */
window.onload = function(){

    var Vertex = function(x, y, z) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
    };

    var Vertex2D = function(x, y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    };

    var Cuboid = function (center, widthX , lengthY,  heightZ) {
        this.widthX = widthX;
        this.lengthY = lengthY;
        this.heightZ = heightZ;
        this.centerPoint = center;
        var x = widthX/2;
        var y = lengthY/2;
        var z = heightZ/2;

        this.vertices = [
            new Vertex(center.x - x, center.y - y, center.z + z),
            new Vertex(center.x - x, center.y - y, center.z - z),
            new Vertex(center.x + x, center.y - y, center.z - z),
            new Vertex(center.x + x, center.y - y, center.z + z),
            new Vertex(center.x + x, center.y + y, center.z + z),
            new Vertex(center.x + x, center.y + y, center.z - z),
            new Vertex(center.x - x, center.y + y, center.z - z),
            new Vertex(center.x - x, center.y + y, center.z + z)
        ];

        // Generate the faces
        this.faces = [
            [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
            [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
            [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
            [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
            [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
            [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
        ];
    }

    function project(M, d) {
        // Distance between the camera and the plane
        //var d = 200;
        var r = d / M.y;
        return new Vertex2D(r * M.x, r * M.z);
    }

    function render(objects, context, dx, dy, zoomFactor) {
        context.clearRect(0, 0, 2*dx, 2*dy);

        for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
            for (var j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
                var face = objects[i].faces[j];

                // Draw only the first vertex
                var P = project(face[0], zoomFactor);
                context.beginPath();
                context.moveTo(P.x + dx, -P.y + dy);

                // Draw the rest
                for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
                    P = project(face[k], zoomFactor);
                    context.lineTo(P.x + dx, -P.y + dy);
                }
                // Drawing
                context.closePath();
                context.stroke();
                context.fill();
            }
        }
    }

    (function() {
        var canvas = document.getElementById('canvas');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        var dx = canvas.width / 2;
        var dy = canvas.height / 2;
        var context = canvas.getContext('2d');
        context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        context.fillStyle = 'rgba(150, 150, 255, 0.5)';

        var sceneCenter = new Vertex(0, 500, -300);
        var street = new Cuboid(sceneCenter, 200, 400, 0.01);

        var rightClosest = new Vertex(sceneCenter.x + 200, sceneCenter.y - 100 , sceneCenter.z +50);
        var leftClosest = new Vertex(sceneCenter.x - 200, sceneCenter.y - 100 , sceneCenter.z +50);
        var rightMiddle = new Vertex(sceneCenter.x + 200, sceneCenter.y + 10, sceneCenter.z +100);
        var leftMiddle = new Vertex(sceneCenter.x - 200, sceneCenter.y +10 , sceneCenter.z +100);
        var rightFarthest = new Vertex(sceneCenter.x + 200, sceneCenter.y + 100, sceneCenter.z + 200);
        var leftFarthest = new Vertex(sceneCenter.x - 200, sceneCenter.y + 100, sceneCenter.z + 200);
        var back = new Vertex(sceneCenter.x, sceneCenter.y+200, sceneCenter.z + 300);

        var rightClosestCuboid= new Cuboid(rightClosest, 100, 75, 100);
        var leftClosestCuboid= new Cuboid(leftClosest, 100, 75, 100);
        var rightMiddleCuboid= new Cuboid(rightMiddle, 100, 75, 200);
        var leftMiddleCuboid= new Cuboid(leftMiddle, 100, 75, 200);
        var rightFarthestCuboid= new Cuboid(rightFarthest, 100, 100, 400);
        var leftFarthestCuboid= new Cuboid(leftFarthest, 100, 100, 400);
        var backstreetCuboid = new Cuboid(back, 800, 10, 600);


        var objects = [backstreetCuboid,
            leftFarthestCuboid,
            rightFarthestCuboid,
            rightMiddleCuboid,
            leftMiddleCuboid,
            rightClosestCuboid,
            leftClosestCuboid,
            street];
        var zoomFactor = 200;

        render(objects, context, dx, dy, zoomFactor);


        document.onkeydown = function(evt){
            // uncomment line bellow to find out other keycodes
//                alert(evt.keyCode)
            switch(event.keyCode)
            {
                case 65://d - right
                    moveAll(new Vertex(10, 0 , 0));
                    break;
                case 68:// a - left
                    moveAll(new Vertex(-10, 0 , 0));
                    break;
                case 83:// w - up
                    moveAll(new Vertex(0, 0 , 10));
                    break;
                case 87: // s - down
                    moveAll(new Vertex(0, 0 , -10));
                    break;
                case 70: // f - front
                    moveAll(new Vertex(0, -10 , 0));
                    break;
                case 66: // b - back
                    moveAll(new Vertex(0, 10 , 0));
                    break;
                case 219: // [  = zoom out
                    zoomFactor -= 5;
                    break;
                case 221: // ] = zoom in
                    zoomFactor += 5;
                    break;
            }
            // refresh after each event
            render(objects, context, dx, dy, zoomFactor);
        }

        var translate = function(object, vector){
            object.x += vector.x;
            object.y += vector.y;
            object.z+= vector.z;
        }

        var moveAll = function(vec){
            for(var i = 0; i< objects.length; i++)
            {
                translate(objects[i].centerPoint, vec);
                objects[i] = refresh(objects[i]);
            }

        }

        var refresh = function(object){
            return new Cuboid(object.centerPoint, object.widthX, object.lengthY, object.heightZ);
        }

        // Events
        var mousedown = false;
        var mx = 0;
        var my = 0;

        canvas.addEventListener('mousedown', initMove);
        document.addEventListener('mousemove', startRotation);
        document.addEventListener('mouseup', stopMove);

        function rotate(M, center, theta, phi) {
            // Rotation matrix coefficients
            var ct = Math.cos(theta);
            var st = Math.sin(theta);
            var cp = Math.cos(phi);
            var sp = Math.sin(phi);

            // Rotation
            var x = M.x - center.x;
            var y = M.y - center.y;
            var z = M.z - center.z;

            M.x = ct * x - st * cp * y + st * sp * z + center.x;
            M.y = st * x + ct * cp * y - ct * sp * z + center.y;
            M.z = sp * y + cp * z + center.z;

        }

        // Initialize the movement
        function initMove(evt) {
            mousedown = true;
            mx = evt.clientX;
            my = evt.clientY;
        }

        function startRotation(evt) {
            if (mousedown) {
                var theta = (evt.clientX - mx) * Math.PI / 360;
                var phi = (evt.clientY - my) * Math.PI / 180;

                for(var j = 0; j < objects.length; j++)
                    for (var i = 0; i < objects[j].vertices.length; ++i)
                        rotate(objects[j].vertices[i], new Vertex(0,0,0), theta, phi);
                        // rotate(objects[j].vertices[i], sceneCenter, theta, phi);

                mx = evt.clientX;
                my = evt.clientY;

                render(objects, context, dx, dy, zoomFactor);
            }
        }

        function stopMove() {
            mousedown = false;
        }

    })();
};