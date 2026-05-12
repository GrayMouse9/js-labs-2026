// Импорты обновлены под новые названия файлов и папок
import {TrajectoryCardComponent} from "../../components/trajectory-card/index.js";
import {TrajectoryPage} from "../trajectory/index.js";
import {ajax} from "../../modules/ajax.js";
import {trajectoryUrls} from "../../modules/trajectoryUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = [];
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
                <div class="container mt-4">
                    <h2 class="text-center display-1 mb-0">Расчет траекторий</h2>

                    <div class="carousel-container-small-margin mb-5">
                        <div id="spaceCarousel" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-indicators" id="carousel-indicators"></div>
                            <div class="carousel-inner" id="carousel-inner"></div>

                            <button class="carousel-control-prev" type="button" data-bs-target="#spaceCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Предыдущий</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#spaceCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Следующий</span>
                            </button>
                        </div>
                    </div>

                    <div id="main-page" class="d-flex flex-wrap justify-content-start gap-3"></div>
                </div>
            `
        )
    }

    getData() {
        ajax.get(trajectoryUrls.getTrajectories(), (data) => {
            this.renderData(data);
        })
    }

    renderData(items) {
        if (!items || !Array.isArray(items)) {
            console.error('Ошибка: данные с сервера не загрузились или пришел не массив');
            return;
        }

        this.data = items;
        this.renderCarousel();
        // this.renderCards(this.data);
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const trajectoryPage = new TrajectoryPage(this.parent, cardId)
        trajectoryPage.render()
    }

    addSearchListener() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchText = e.target.value.toLowerCase();
                const filteredData = this.data.filter(item => item.title.toLowerCase().includes(searchText));
                this.renderCards(filteredData);
            });
        }
    }

    renderCards(dataToRender) {
        this.pageRoot.innerHTML = '';
        dataToRender.forEach((item) => {
            // Используем TrajectoryCardComponent
            const trajectoryCard = new TrajectoryCardComponent(this.pageRoot)
            trajectoryCard.render(item, this.clickCard.bind(this))
        })
    }

    renderCarousel() {
        const indicatorsContainer = document.getElementById('carousel-indicators');
        const innerContainer = document.getElementById('carousel-inner');

        indicatorsContainer.innerHTML = '';
        innerContainer.innerHTML = '';

        this.data.forEach((item, index) => {
            const isActive = index === 0 ? 'active' : '';
            const imgClass = item.id === 3 ? 'small-img' : 'square-img';

            indicatorsContainer.insertAdjacentHTML('beforeend', `
                <button type="button" data-bs-target="#spaceCarousel" data-bs-slide-to="${index}"
                    class="${isActive}" aria-current="${isActive === 'active' ? 'true' : 'false'}"
                    aria-label="Slide ${index + 1}"></button>
            `);

            innerContainer.insertAdjacentHTML('beforeend', `
                <div class="carousel-item ${isActive}" data-carousel-id="${item.id}" style="cursor: pointer;">
                    <img src="${item.src}" class="d-block mx-auto carousel-slide ${imgClass}" alt="${item.title}">
                    <div class="carousel-caption d-none d-md-block glass-caption">
                        <h4 class="text-white">${item.title}</h4>
                        <div class="d-flex justify-content-center gap-3 mt-2">
                            <small> Импульс: <strong>${item.impulse || '-'}</strong></small>
                            <small> Время: <strong>${item.time || '-'}</strong></small>
                        </div>
                    </div>
                </div>
            `);
        });

        this.addCarouselClickListeners();
    }

    addCarouselClickListeners() {
        const slides = document.querySelectorAll('.carousel-item');
        slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                if (e.target.closest('.carousel-control-prev') ||
                    e.target.closest('.carousel-control-next') ||
                    e.target.closest('.carousel-indicators button')) {
                    return;
                }
                const cardId = slide.dataset.carouselId;
                const trajectoryPage = new TrajectoryPage(this.parent, cardId);
                trajectoryPage.render();
            });
        });
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.addSearchListener();
        this.getData();
    }
}
