import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

function sumOfSquares(arr) {
  return arr.reduce((sum, current) => sum + (current ** 2), 0);
}

function getSumAndMultOfArray(arr) {
  if (!arr || arr.length === 0) return {sum: 0, mult: 0};
  return {
    sum: arr.reduce((acc, val) => acc + val, 0),
    mult: arr.reduce((acc, val) => acc * val, 1)
  };
}

function removeValues(arr, ...valuesToRemove) {
  return arr.filter(item => !valuesToRemove.includes(item));
}

function inverse(arr, num) {
  const arrCopy = [...arr];
  if (num === undefined || isNaN(num)) return arrCopy.reverse();
  if (num >= 0) {
    const kept = arrCopy.slice(0, num);
    const reversed = arrCopy.slice(num).reverse();
    return [...kept, ...reversed];
  } else {
    const splitIndex = arrCopy.length + num;
    const reversed = arrCopy.slice(0, splitIndex).reverse();
    const kept = arrCopy.slice(splitIndex);
    return [...reversed, ...kept];
  }
}

export class ServiceComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return (`
                <div class="container-fluid text-white my-5" style="font-family: 'Cheque', sans-serif;">
                    <div class="row align-items-center">

                        <div class="col-md-6 mb-4 mb-md-0">
                            <div id="3d-container" class="rounded shadow-lg" style="width: 100%; height: 75vh; overflow: hidden; background: radial-gradient(circle, #1e293b 0%, #02040a 100%); border: 1px solid #334155;">
                            </div>
                        </div>

                        <div class="col-md-6 px-md-5">
                            <h2 class="display-4 mb-3">${data.title}</h2>
                            <p class="mb-4" style="font-family: 'Inter', sans-serif; font-size: 0.9rem;">${
        data.text}</p>

                            <div id="hw-results" class="border border-white rounded p-3 mb-3 bg-transparent text-white d-none">
                                <strong class="fs-5 text-white mb-2 d-block">Интерактивный пульт телеметрии:</strong>

                                <div class="mb-2">
                                    <label class="form-label" style="font-size: 0.9rem;">Введите массив чисел через запятую:</label>
                                    <input type="text" id="input-raw" class="form-control form-control-sm bg-dark text-white border-secondary" value="2, 4, 0, 6, -99, 8, 10">
                                </div>

                                <div class="row g-2 mb-3">
                                    <div class="col-6">
                                        <label class="form-label" style="font-size: 0.9rem;">Выберите числа, которые хотели бы удалить:</label>
                                        <input type="text" id="input-remove" class="form-control form-control-sm bg-dark text-white border-secondary" value="0, -99">
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label" style="font-size: 0.9rem;">Выберите элементы, которые не подвергнутся инверсии:</label>
                                        <input type="number" id="input-inverse" class="form-control form-control-sm bg-dark text-white border-secondary" value="2">
                                    </div>
                                </div>

                                <button id="recalc-btn" class="btn btn-outline-light w-100 mb-4 py-2" style="font-family: 'Cheque', sans-serif; letter-spacing: 2px; text-transform: uppercase;  transition: all 0.3s ease;">
                                    Пересчитать телеметрию
                                </button>

                                <span class="fs-6 d-block">Удаление элементов (2.13): <span id="res-clean" class="fw-bold text-success"></span></span>
                                <span class="fs-6 d-block">Сумма квадратов (1.3): <span id="res-squares" class="fw-bold text-success"></span></span>
                                <span class="fs-6 d-block">Сумма и произв. (1.4): <span id="res-sum-mult" class="fw-bold text-success"></span></span>
                                <span class="fs-6 d-block">Инверсия массива (3.2): <span id="res-inverse" class="fw-bold text-success"></span></span>
                            </div>

                            <span id="error-msg" class="text-danger fw-bold mb-2 d-none d-block">Пожалуйста, введите массу аппарата!</span>

                        </div>

                    </div>
                </div>
            `);
  }

  init3DViewer(containerId, modelUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
        'https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    const finalModelUrl = modelUrl || './models/moon.glb';

    loader.load(finalModelUrl, (gltf) => {
      const object = gltf.scene;
      object.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;

      object.position.x = -center.x;
      object.position.y = -box.min.y;
      object.position.z = -center.z;

      scene.add(object);

      camera.position.set(0, maxDim * 0.5, maxDim * 2);
      controls.target.set(0, maxDim * 0.3, 0);
      controls.update();
    }, undefined, (error) => console.error('Ошибка загрузки 3D:', error));

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }

  addListeners() {
    const recalcBtn = document.getElementById('recalc-btn');
    const errorMsg = document.getElementById('error-msg');

    const performCalculations = () => {
      const rawStr = document.getElementById('input-raw').value;
      const rawTelemetry = rawStr.split(',')
                               .map(item => Number(item.trim()))
                               .filter(n => !isNaN(n));

      const removeStr = document.getElementById('input-remove').value;
      const removeValuesArr = removeStr.split(',')
                                  .map(item => Number(item.trim()))
                                  .filter(n => !isNaN(n));

      const inverseIndex =
          parseInt(document.getElementById('input-inverse').value, 10);

      const cleanTelemetry = removeValues(rawTelemetry, ...removeValuesArr);
      const energyDispersion = sumOfSquares(cleanTelemetry);
      const loads = getSumAndMultOfArray(cleanTelemetry);
      const returnTrajectory = inverse(cleanTelemetry, inverseIndex);

      document.getElementById('res-clean').textContent =
          `[${cleanTelemetry.join(', ')}]`;
      document.getElementById('res-squares').textContent = energyDispersion;
      document.getElementById('res-sum-mult').textContent =
          `Сумма: ${loads.sum}, Произв: ${loads.mult}`;
      document.getElementById('res-inverse').textContent =
          `[${returnTrajectory.join(', ')}]`;
    };

    const resultsDiv = document.getElementById('hw-results');
    resultsDiv.classList.remove('d-none');

    performCalculations();

    if (recalcBtn) {
      recalcBtn.addEventListener('click', performCalculations);
    }
  }

  render(data) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners();

    this.init3DViewer('3d-container', data.model);
  }
}
