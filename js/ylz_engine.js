Engine = function(){
	this.cssObjScale = .003;
	var scope = this;
	this.init = function(container){
		
		/**容器*/
		if(container === undefined){
			this.container = document.createElement('div');
			this.container.style.backgroundColor = "#FFFFFF";
			document.body.appendChild(this.container);
			this.containerWidth =  window.innerWidth;
			this.containerHeight = window.innerHeight;
		}else{
			this.container = container;
			this.containerWidth =  container.offsetWidth; //$(container).width();
			this.containerHeight = container.offsetHeight; //$(container).height();
		}
		
		/**渲染器*/
		this.renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.renderer.setPixelRatio( 1 );//this.containerHeight / this.containerWidth
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.container.appendChild( this.renderer.domElement );
		
		this.scene = new THREE.Scene();
		
		/**CSS3D渲染器*/
        this.cssrenderer = new THREE.CSS3DRenderer();
        this.cssrenderer.setSize(window.innerWidth, window.innerHeight);
        this.cssrenderer.domElement.style.position = 'absolute';
        this.cssrenderer.domElement.style.top = 0;
        this.container.appendChild(this.cssrenderer.domElement);
        this.cssscene = new THREE.Scene();
		
		/**透视相机*/
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 0.00001;
		
		/**全局光照*/
		var ambient = new THREE.AmbientLight(0xFFFFFF, 1);
		this.scene.add(ambient);
		
		/**控制器*/
		this.controls = new THREE.OrbitControls( this.camera );
		this.controls.enableZoom = false;
		this.controls.enablePan = false;
		
		window.addEventListener( 'resize', onWindowResize, false );
		animate();
	}
	
	/**
	 * 创建
	 */
	this.makeCSS3DSprite = function(ele){
		var sprite = new THREE.CSS3DSprite(ele);
        sprite.scale.x = this.cssObjScale;
        sprite.scale.y = this.cssObjScale;
        if(ele.position != undefined)
        	sprite.position.copy(ele.position);
        if(ele.rotation != undefined)
        	sprite.rotation.copy(ele.rotation)
        scope.cssscene.add(sprite);
        ele.sprite = sprite;
        return sprite;
	}
	
	function onWindowResize() {
		scope.camera.aspect = scope.containerWidth / scope.containerHeight;
		scope.camera.updateProjectionMatrix();
		scope.renderer.setSize(scope.containerWidth, scope.containerHeight);
	}

	function animate() {
		TWEEN.update();
		requestAnimationFrame(animate);
		render();
	}

	function render() {
		scope.renderer.render(scope.scene, scope.camera);
		scope.cssrenderer.render(scope.cssscene, scope.camera);
	}
};
THREE.CSS3DObject = function ( element ) {

    THREE.Object3D.call( this );

    this.element = element;
    this.element.style.position = 'absolute';

    this.addEventListener( 'removed', function ( event ) {

        if ( this.element.parentNode !== null ) {

            this.element.parentNode.removeChild( this.element );

            for ( var i = 0, l = this.children.length; i < l; i ++ ) {

                this.children[ i ].dispatchEvent( event );

            }

        }

    } );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );

THREE.CSS3DSprite = function ( element ) {

    THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );

//

THREE.CSS3DRenderer = function () {

    console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

    var _width, _height;
    var _widthHalf, _heightHalf;

    var matrix = new THREE.Matrix4();

    var domElement = document.createElement( 'div' );
    domElement.style.overflow = 'hidden';

    domElement.style.WebkitTransformStyle = 'preserve-3d';
    domElement.style.MozTransformStyle = 'preserve-3d';
    domElement.style.oTransformStyle = 'preserve-3d';
    domElement.style.transformStyle = 'preserve-3d';

    this.domElement = domElement;

    var cameraElement = document.createElement( 'div' );

    cameraElement.style.WebkitTransformStyle = 'preserve-3d';
    cameraElement.style.MozTransformStyle = 'preserve-3d';
    cameraElement.style.oTransformStyle = 'preserve-3d';
    cameraElement.style.transformStyle = 'preserve-3d';

    domElement.appendChild( cameraElement );

    this.setClearColor = function () {

    };

    this.setSize = function ( width, height ) {

        _width = width;
        _height = height;

        _widthHalf = _width / 2;
        _heightHalf = _height / 2;

        domElement.style.width = width + 'px';
        domElement.style.height = height + 'px';

        cameraElement.style.width = width + 'px';
        cameraElement.style.height = height + 'px';

    };

    var epsilon = function ( value ) {

        return Math.abs( value ) < 0.000001 ? 0 : value;

    };

    var getCameraCSSMatrix = function ( matrix ) {

        var elements = matrix.elements;

        return 'matrix3d(' +
            epsilon( elements[ 0 ] ) + ',' +
            epsilon( - elements[ 1 ] ) + ',' +
            epsilon( elements[ 2 ] ) + ',' +
            epsilon( elements[ 3 ] ) + ',' +
            epsilon( elements[ 4 ] ) + ',' +
            epsilon( - elements[ 5 ] ) + ',' +
            epsilon( elements[ 6 ] ) + ',' +
            epsilon( elements[ 7 ] ) + ',' +
            epsilon( elements[ 8 ] ) + ',' +
            epsilon( - elements[ 9 ] ) + ',' +
            epsilon( elements[ 10 ] ) + ',' +
            epsilon( elements[ 11 ] ) + ',' +
            epsilon( elements[ 12 ] ) + ',' +
            epsilon( - elements[ 13 ] ) + ',' +
            epsilon( elements[ 14 ] ) + ',' +
            epsilon( elements[ 15 ] ) +
            ')';

    };

    var getObjectCSSMatrix = function ( matrix ) {

        var elements = matrix.elements;

        return 'translate3d(-50%,-50%,0) matrix3d(' +
            epsilon( elements[ 0 ] ) + ',' +
            epsilon( elements[ 1 ] ) + ',' +
            epsilon( elements[ 2 ] ) + ',' +
            epsilon( elements[ 3 ] ) + ',' +
            epsilon( - elements[ 4 ] ) + ',' +
            epsilon( - elements[ 5 ] ) + ',' +
            epsilon( - elements[ 6 ] ) + ',' +
            epsilon( - elements[ 7 ] ) + ',' +
            epsilon( elements[ 8 ] ) + ',' +
            epsilon( elements[ 9 ] ) + ',' +
            epsilon( elements[ 10 ] ) + ',' +
            epsilon( elements[ 11 ] ) + ',' +
            epsilon( elements[ 12 ] ) + ',' +
            epsilon( elements[ 13 ] ) + ',' +
            epsilon( elements[ 14 ] ) + ',' +
            epsilon( elements[ 15 ] ) +
            ')';

    };

    var renderObject = function ( object, camera ) {

        if ( object instanceof THREE.CSS3DObject ) {

            var style;

            if ( object instanceof THREE.CSS3DSprite ) {

                // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

                matrix.copy( camera.matrixWorldInverse );
                matrix.transpose();
                matrix.copyPosition( object.matrixWorld );
                matrix.scale( object.scale );

                matrix.elements[ 3 ] = 0;
                matrix.elements[ 7 ] = 0;
                matrix.elements[ 11 ] = 0;
                matrix.elements[ 15 ] = 1;

                style = getObjectCSSMatrix( matrix );

            } else {

                style = getObjectCSSMatrix( object.matrixWorld );

            }

            var element = object.element;

            element.style.WebkitTransform = style;
            element.style.MozTransform = style;
            element.style.oTransform = style;
            element.style.transform = style;

            if ( element.parentNode !== cameraElement ) {

                cameraElement.appendChild( element );

            }

        }

        for ( var i = 0, l = object.children.length; i < l; i ++ ) {

            renderObject( object.children[ i ], camera );

        }

    };

    this.render = function ( scene, camera ) {

        var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

        domElement.style.WebkitPerspective = fov + "px";
        domElement.style.MozPerspective = fov + "px";
        domElement.style.oPerspective = fov + "px";
        domElement.style.perspective = fov + "px";

        scene.updateMatrixWorld();

        if ( camera.parent === undefined ) camera.updateMatrixWorld();

        camera.matrixWorldInverse.getInverse( camera.matrixWorld );

        var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
            " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

        cameraElement.style.WebkitTransform = style;
        cameraElement.style.MozTransform = style;
        cameraElement.style.oTransform = style;
        cameraElement.style.transform = style;

        renderObject( scene, camera );

    };

};


    this.setSize = function ( width, height ) {

        _width = width;
        _height = height;

        _widthHalf = _width / 2;
        _heightHalf = _height / 2;

        domElement.style.width = width + 'px';
        domElement.style.height = height + 'px';

        cameraElement.style.width = width + 'px';
        cameraElement.style.height = height + 'px';

    };

    var epsilon = function ( value ) {

        return Math.abs( value ) < 0.000001 ? 0 : value;

    };

    var getCameraCSSMatrix = function ( matrix ) {

        var elements = matrix.elements;

        return 'matrix3d(' +
            epsilon( elements[ 0 ] ) + ',' +
            epsilon( - elements[ 1 ] ) + ',' +
            epsilon( elements[ 2 ] ) + ',' +
            epsilon( elements[ 3 ] ) + ',' +
            epsilon( elements[ 4 ] ) + ',' +
            epsilon( - elements[ 5 ] ) + ',' +
            epsilon( elements[ 6 ] ) + ',' +
            epsilon( elements[ 7 ] ) + ',' +
            epsilon( elements[ 8 ] ) + ',' +
            epsilon( - elements[ 9 ] ) + ',' +
            epsilon( elements[ 10 ] ) + ',' +
            epsilon( elements[ 11 ] ) + ',' +
            epsilon( elements[ 12 ] ) + ',' +
            epsilon( - elements[ 13 ] ) + ',' +
            epsilon( elements[ 14 ] ) + ',' +
            epsilon( elements[ 15 ] ) +
            ')';

    };

    var getObjectCSSMatrix = function ( matrix ) {

        var elements = matrix.elements;

        return 'translate3d(-50%,-50%,0) matrix3d(' +
            epsilon( elements[ 0 ] ) + ',' +
            epsilon( elements[ 1 ] ) + ',' +
            epsilon( elements[ 2 ] ) + ',' +
            epsilon( elements[ 3 ] ) + ',' +
            epsilon( - elements[ 4 ] ) + ',' +
            epsilon( - elements[ 5 ] ) + ',' +
            epsilon( - elements[ 6 ] ) + ',' +
            epsilon( - elements[ 7 ] ) + ',' +
            epsilon( elements[ 8 ] ) + ',' +
            epsilon( elements[ 9 ] ) + ',' +
            epsilon( elements[ 10 ] ) + ',' +
            epsilon( elements[ 11 ] ) + ',' +
            epsilon( elements[ 12 ] ) + ',' +
            epsilon( elements[ 13 ] ) + ',' +
            epsilon( elements[ 14 ] ) + ',' +
            epsilon( elements[ 15 ] ) +
            ')';

    };

    var renderObject = function ( object, camera ) {

        if ( object instanceof THREE.CSS3DObject ) {

            var style;

            if ( object instanceof THREE.CSS3DSprite ) {

                // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

                matrix.copy( camera.matrixWorldInverse );
                matrix.transpose();
                matrix.copyPosition( object.matrixWorld );
                matrix.scale( object.scale );

                matrix.elements[ 3 ] = 0;
                matrix.elements[ 7 ] = 0;
                matrix.elements[ 11 ] = 0;
                matrix.elements[ 15 ] = 1;

                style = getObjectCSSMatrix( matrix );

            } else {

                style = getObjectCSSMatrix( object.matrixWorld );

            }

            var element = object.element;

            element.style.WebkitTransform = style;
            element.style.MozTransform = style;
            element.style.oTransform = style;
            element.style.transform = style;

            if ( element.parentNode !== cameraElement ) {

                cameraElement.appendChild( element );

            }

        }

        for ( var i = 0, l = object.children.length; i < l; i ++ ) {

            renderObject( object.children[ i ], camera );

        }

    };

    this.render = function ( scene, camera ) {

        var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

        domElement.style.WebkitPerspective = fov + "px";
        domElement.style.MozPerspective = fov + "px";
        domElement.style.oPerspective = fov + "px";
        domElement.style.perspective = fov + "px";

        scene.updateMatrixWorld();

        if ( camera.parent === undefined ) camera.updateMatrixWorld();

        camera.matrixWorldInverse.getInverse( camera.matrixWorld );

        var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
            " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

        cameraElement.style.WebkitTransform = style;
        cameraElement.style.MozTransform = style;
        cameraElement.style.oTransform = style;
        cameraElement.style.transform = style;

        renderObject( scene, camera );

    };

