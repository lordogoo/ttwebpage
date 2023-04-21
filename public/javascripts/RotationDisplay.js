class RotationDisplay{
	constructor(canvas,modelurl,setDefaults){
		this.Canvas = canvas;
		this.setDefaults = setDefaults;

		this.mixer = [];
		this.duration = [];
		this.animationPlaying = false;
		this.animationIndex = 0;
		this.animationGap = 100;
		this.animationEnd = this.animationGap;
		this.time = 0;

		this.Scene = new THREE.Scene();
		this.Clock = new THREE.Clock();
		this.Camera = new THREE.PerspectiveCamera( 50, this.Canvas.offsetWidth / this.Canvas.offsetHeight, 0.1, 1000 );

		this.Renderer = new THREE.WebGLRenderer({ canvas: this.Canvas, alpha: true });
		this.Renderer.setPixelRatio( window.devicePixelRatio );
		this.Renderer.setSize( this.Canvas.offsetWidth, this.Canvas.offsetHeight );

		this.Light = new THREE.PointLight(0xffffff);
		this.Light.position.set(5,5,5);
		this.Scene.add(this.Light);
	
		this.Ambient = new THREE.AmbientLight(0xffffff,0.5);
		this.Scene.add(this.Ambient);

		this.Camera.position.z = 5;

		let gltfLoader = new THREE.GLTFLoader();

		gltfLoader.load(modelurl, (gltf) => {
			this.Model = gltf.scene;
			this.setDefaults(this.Model);
			this.Scene.add(this.Model);
        		gltf.animations.forEach( ( clip ) => {
				let newmixer = new THREE.AnimationMixer( gltf.scene )
				this.mixer.push(newmixer);
          			this.duration.push(clip.duration);
            			newmixer.clipAction( clip ).play();
        		});
		});

	}

	update(ele,defaultvalue){
		var delta = this.Clock.getDelta();
		
		if(this.animationPlaying){
			if(this.mixer[this.animationIndex]) this.mixer[this.animationIndex].update( delta );
		}

		if(this.time >= this.animationEnd){
			this.animationPlaying = !this.animationPlaying;
			this.time = 0;
			if(this.animationPlaying){
				this.animationIndex++;
				if(this.animationIndex >= this.mixer.length){
					this.animationIndex = 0;
				}
				this.animationEnd = this.duration[this.animationIndex]*60;
			}else{
				this.animationEnd = this.animationGap;
			}

		}

		if(this.Model != null){
			this.Model.rotation.y = defaultvalue + ele.value*Math.PI/16;
		}
		this.Renderer.render( this.Scene, this.Camera);
		this.time++;
	}

}