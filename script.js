// data
const timeline = [
	{
		heading: "Schooling",
		title: "Podar International School, Aurangabad, Maharashtra."

	},
    {
		heading: "Current Education",
        title: "Kalvium X LPU: Bachelor of Technology(B-Tech), Phagwara, Punjab."
    },
	{
		heading: "About Me",
		title: "Aspiring full-stack developer. Currently advancing into C++ 18.0 (primary programming language), Python 3.0 (secondary), HTML 5, CSS and JavaScript. Future plans include Business startups, Entrepreneurship, Hosting fests and World tourism."
	},
	{
		heading: "Skills",
		title: "C++, Python, HTML, CSS, JavaScript, Critical Thinking."
	},
	{ 
      
        heading: "Languages", 
        title: "English(Professional working proficiency), Hindi(Native), Marathi(Bilingual), French(Elemenry proficiency)." 
    },
	{
		heading: "Experience",
		title: "Student: @Kalvium, Social Media Marketing Intern: @Babycloud."
	},
	{
		heading: "Softwares Known",
		title: "MS Office Suit, Adobe Illustrator, Premier Pro, Adobe Photoshop, After Effects, Figma, Zoom."
	},
	{
		heading: "Major Projects",
		title: "Foodfolio - The food listing app. Check top-right corner."
	},
];

//
const mario = document.getElementById("mario");
const ground = document.getElementById("ground");
const grass = document.getElementById("grass");
const eventsContainer = document.getElementById("events");
let currentIndex = -1;
let currentPipe;
let int1;

// click handler
const pipeHandler = (event) => {
	clearInterval(int1);

	document.getElementById("info").style.display = "none";

	// clear old
	!currentPipe || currentPipe.classList.remove("active");

	// get index
	const index = parseInt(event.currentTarget.dataset.index);

	// walk
	const xpos = -100 - index * 150 - 25;
	const curXpos = -100 - currentIndex * 150 - 25;
	const distance = curXpos - xpos;
	const duration = Math.abs(distance) * 3;
	// console.log(distance);
	eventsContainer.style.transitionDuration = `${duration}ms`;
	eventsContainer.style.transform = `translateX(${xpos}px)`;
	ground.style.transitionDuration = `${duration}ms`;
	ground.style.backgroundPosition = `${xpos}px 32px`;
	grass.style.transitionDuration = `${duration}ms`;
	grass.style.backgroundPosition = `${xpos}px 0`;

	//
	playSfx("jump");

	// walk style
	const dir = distance < 0 ? "left" : "right";
	mario.classList.remove(
		"idle",
		"walk-left",
		"walk-right",
		"search-left",
		"search-right"
	);
	mario.classList.add(`walk-${dir}`);
	int1 = setTimeout(
		(dir, target) => {
			mario.classList.remove(`walk-${dir}`);
			mario.classList.add(`search-${dir}`);
			target.classList.add("active");
			playSfx("pipe");
		},
		duration,
		dir,
		event.currentTarget
	);

	// store position
	currentIndex = index;
	currentPipe = event.currentTarget;
};

// setup timeline
timeline.forEach((event, index) => {
	const e = document.createElement("div");
	e.classList.add("event");
	e.dataset.index = index;
	e.dataset.title = event.title;
	e.dataset.month = event.heading;
	eventsContainer.appendChild(e);
	e.addEventListener("click", pipeHandler.bind(this));
});

/**
 * Audio handling
 */
const canAudio = "AudioContext" in window || "webkitAudioContext" in window;
const buffers = {};
let context = void 0;

if (canAudio) {
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext(); // Make it crossbrowser
	var gainNode = context.createGain();
	gainNode.gain.value = 1; // set volume to 100%
}

const playSfx = function play(id) {
	if (!canAudio || !buffers.hasOwnProperty(id)) return;
	const buffer = buffers[id];
	const source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start();
};

const loadBuffers = (urls, ids) => {
	if (typeof urls == "string") urls = [urls];
	if (typeof ids == "string") ids = [ids];
	urls.forEach((url, index) => {
		window
			.fetch(url)
			.then((response) => response.arrayBuffer())
			.then((arrayBuffer) =>
				context.decodeAudioData(
					arrayBuffer,
					(audioBuffer) => {
						buffers[ids[index]] = audioBuffer;
					},
					(error) => console.log(error)
				)
			);
	});
};

loadBuffers(
	[
		"https://assets.codepen.io/439000/jump.mp3",
		"https://assets.codepen.io/439000/smb_pipe.mp3"
	],
	["jump", "pipe"]
);
