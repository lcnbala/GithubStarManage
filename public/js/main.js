'use strict'


/* Variables */
var lang = 'pt';
var window_w, window_h;
var scroll_x, scroll_y;
var slide, slide_tween;

var camera, scene, renderer;
var geometry, geometry_wire, material, material_wire, mesh, mesh_wire, draw;

var mesh_angles = Array();
var mesh_speeds = Array();

var work_animate = 1;

var typewriter_el, typewriter_code, typewriter_count, typewriter_interval, typewriter_init;




/* Helpful */

function $(query) {
    return document.querySelectorAll(query);
};






/* Setup */

document.addEventListener('DOMContentLoaded', init, false);

window.onresize = function() {
    windowOnResize();
};

window.onscroll = function(e) {

    windowOnScroll();
}




/* Init */

function init() {


    // MBP
    MBP.scaleFix();





    // Menu
    for (var n = 0; n < $('#cover nav a').length; n++) {
        $('#cover nav a')[n].onclick = function() {
            var obj = this.pathname.replace(/\//g, '');

            windowPathname(obj);

            return false;
        };
    }



    // Contact
    for (var c = 0; c < $('#contact .social a').length; c++) {
        $('#contact .social a')[c].innerHTML = '';
    }




    // Typewriter
    if ($('#about').length) {
        typewriter_el = $('#about p')[0];
        typewriter_code = typewriter_el.innerHTML;
        typewriter_code = typewriter_el.innerHTML.replace(/(<([^>]+)>)/ig, "");
        typewriter_code = typewriter_code.trim().replace(/\t/g, '');
        typewriter_count = 0;
        typewriter_el.innerHTML = '';
    }




    // Waves
    if ($('#cover').length) {

        camera = new THREE.PerspectiveCamera(60, window_w / window_h, 1, 10000);
        camera.position.x = 500;
        camera.position.y = -600;
        camera.position.z = 400;
        camera.rotation.x = 1;
        camera.rotation.y = 0.2;
        camera.rotation.z = -0.2;

        scene = new THREE.Scene();

        var geometry_w = 6;
        var geometry_h = 3;

        if (Modernizr.touch) {
            geometry_w = 3;
            geometry_h = 2;
        }

        geometry = new THREE.PlaneGeometry(2000, 1000, geometry_w, geometry_h);
        geometry_wire = new THREE.PlaneGeometry(2000, 1000, geometry_w, geometry_h);

        for (var i in geometry.vertices) {
            mesh_angles.push((i % 5));
            mesh_speeds.push((1 + (Math.random() * 4)) * 0.01);
        }

        material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        });
        material_wire = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            wireframeLinewidth: 0.3
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -0.5;
        scene.add(mesh);

        mesh_wire = new THREE.Mesh(geometry_wire, material_wire);
        mesh_wire.rotation.x = -0.5;
        scene.add(mesh_wire);

        renderer = new THREE.CanvasRenderer({
            antialias: false,
            alpha: true
        });
        renderer.setSize(window_w, window_h);

        if ($('#cover').length) {
            $('#cover')[0].appendChild(renderer.domElement);
        }

    }



    // Setup

    if (window.location.pathname.length >= 2) {
        setTimeout(function() {
            windowPathname(window.location.pathname.replace(/\//g, ''));
        }, 1000);
    }

    windowOnResize();
    windowOnScroll();

    if (camera) {
        animation();
    }


};


function windowPathname(obj) {

    windowHistory('/' + obj + '/');

    switch (obj) {
        case 'works':
        case 'trabalhos':
            obj = $('#works');
            break;

        case 'about':
        case 'sobre':
            obj = $('#about');
            break;

        case 'contact':
        case 'contato':
            obj = $('#contact');
            break;

        case '404':
            obj = $('#error');
            break;

        default:
            obj = $('#cover');
            break;
    }


    slideTo(0, obj[0].offsetTop);

};


function windowOnResize() {

    // Window
    window_w = document.body.offsetWidth;
    window_h = window.innerHeight;


    // Body
    if (!$('#error').length) {
        $('body')[0].style.margin = (window_h) + 'px 0 0 0';
    }


    // Cover
    if ($('#cover').length) {
        $('#cover')[0].style.width = window_w + 'px';
        $('#cover')[0].style.height = window_h + 'px';

        // Waves
        if (camera) {
            camera.aspect = window_w / window_h;
            camera.updateProjectionMatrix();
            renderer.setSize(window_w, window_h);
        }
    }



    // Works
    if ($('#works').length) {

        var works_z = $('#works .work').length;
        for (var w = 0; w < $('#works .work').length; w++) {
            if (window_w >= 768)
                $('#works .work')[w].style.width = Math.floor(window_w / 2) + 'px';
            else
                $('#works .work')[w].style.width = (window_w) + 'px';

            $('#works .work')[w].style.zIndex = works_z;

            works_z--;
        }

        works_z = $('#works .wrap').length;
        for (var w = 0; w < $('#works .wrap').length; w++) {
            $('#works .wrap')[w].style.zIndex = works_z;
            works_z--;
        }
    }






};





function windowOnScroll() {


    scroll_x = window.scrollX || window.pageXOffset;
    scroll_y = window.scrollY || window.pageYOffset;


    // Cover
    if ($('#cover').length) {
        if (scroll_y >= window_h) {
            $('#cover')[0].style.display = 'none';
        } else {
            $('#cover')[0].style.display = 'block';
        }

        if (!Modernizr.touch) {
            if (camera) {
                camera.position.y = -600 + (scroll_y / 2);
                camera.position.z = 400 + (scroll_y * 2);
                camera.rotation.x = 1 - ((scroll_y / 1000) * 1.5);
            }
        }

    }



    // Works
    if ($('#works').length) {

        for (var w = 0; w < $('#works .work').length; w++) {

            if (window_w >= 1024)
                var offset = ($('#works .work')[w].parentElement.offsetTop + $('#works .work')[w].parentElement.parentElement.offsetTop) - scroll_y;
            else
                var offset = ($('#works .work')[w].offsetTop + $('#works .work')[w].parentElement.offsetTop + $('#works .work')[w].parentElement.parentElement.offsetTop) - scroll_y;

            if (offset <= (window_h - 128)) {
                $('#works .work')[w].classList.add('active');
            }
        }

    }


    // About
    if ($('#about').length) {
        if ((($('#about')[0].offsetTop) - scroll_y) <= window_h / 2) {
            if (!typewriter_init) {
                if (typewriter_el) {
                    typewriter_interval = setInterval(typewriter, 5);
                    typewriter_init = 1;
                    typewriter_el.classList.add('active');

                }
            }
        }
    }



    // Footer
    if ($('#footer').length) {
        if (($('#footer')[0].offsetTop - scroll_y) <= (window_h - 64)) {
            $('#footer')[0].classList.add('active');
        }
    }

};





// Animation

function animation() {

    requestAnimationFrame(animation);

    if ($('#cover').length) {

        for (var i in geometry.vertices) {
            mesh.geometry.vertices[i].z = 0 + Math.sin(mesh_angles[i]) * 100;
            mesh_wire.geometry.vertices[i].z = 0 + Math.sin(mesh_angles[i] + 0.5) * 80;
            mesh_angles[i] += mesh_speeds[i];
        }

        TWEEN.update();

        renderer.render(scene, camera);
    }


};



// Typewriter

function typewriter() {
    if (typewriter_count < typewriter_code.length) {
        typewriter_el.innerHTML += typewriter_code[typewriter_count];
        typewriter_count++;
    } else {
        clearInterval(typewriter_interval);
        typewriter_el.innerHTML = typewriter_el.innerHTML.replace('lab', '<a href="/lab/">lab</a>');
    }

    typewriter_el.innerHTML = typewriter_el.innerHTML.replace('\n\n', '<br /><br />');


};



// SlideTo

function slideTo(x, y) {

    slide = 1;
    slide_tween = new TWEEN.Tween({
        x: scroll_x,
        y: scroll_y
    }).to({
        x: x,
        y: y
    }, 1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function() {
        window.scrollTo(this.x, this.y);
        slide = 0;
    }).start();
}
