import {ServiceCardComponent} from "../../components/service-card/index.js";
import {ServicePage} from "../service/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = this.getData();
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
        return [
            {
                id: 1,
                src: "./img/rocket.png",
                title: "Прямой перелет",
                text: "Классическая баллистическая схема TLI (Trans-Lunar Injection), использовавшаяся в миссии Artemis I. Космический аппарат получает мощный импульс на низкой околоземной орбите и отправляется напрямую к Луне. Гарантирует максимальную скорость доставки экипажа, но требует колоссальных затрат топлива и сверхтяжелой ракеты-носителя.",
                badgeClass: "text-bg-danger",
                impulse: "3 150 м/с",
                time: "3-4 дня",
                model: "./models/RocketShip.glb"
            },
            {
                id: 2,
                src: "./img/satellite.webp",
                title: "Гравитационный маневр",
                text: "Трансфер по слабой границе стабильности (WSB). Умная траектория, применяемая для кубсатов и модулей поддержки программы Artemis (например, миссия CAPSTONE). Аппарат использует гравитацию Земли и Солнца, чтобы «забросить» себя на орбиту Луны. Позволяет сэкономить до 20% топлива, но значительно увеличивает время перелета.",
                badgeClass: "text-bg-success",
                impulse: "2 800 м/с",
                time: "14-20 дней",
                model: "./models/InternationalSpaceStation.glb"
            },
            {
                id: 3,
                src: "./img/asrtronaut.png",
                title: "Перелет с ожиданием",
                text:"Фазирующая орбита (Phasing loops). Аппарат совершает несколько высокоэллиптических витков вокруг Земли перед финальным рывком к Луне. Применяется для синхронизации пилотируемого корабля со станцией Lunar Gateway. Позволяет протестировать все системы в космосе до невозврата и дождаться идеального баллистического окна.",

                badgeClass: "text-bg-warning",
                impulse: "3 050 м/с",
                time: "От 30 дней",
                model: "./models/Moon.glb"
            },
        ]
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const servicePage = new ServicePage(this.parent, cardId)
        servicePage.render()
    }

    addSearchListener() {
        document.getElementById('search-input').addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const filteredData = this.data.filter(item => item.title.toLowerCase().includes(searchText));
            this.renderCards(filteredData);
        });
    }

    renderCards(dataToRender) {
        this.pageRoot.innerHTML = '';
        dataToRender.forEach((item) => {
            const serviceCard = new ServiceCardComponent(this.pageRoot)
            serviceCard.render(item, this.clickCard.bind(this))
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
                        <small>🚀 Импульс: <strong>${item.impulse}</strong></small>
                        <small>⏳ Время: <strong>${item.time}</strong></small>
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
            // Не срабатываем, если клик по кнопке управления каруселью
            if (e.target.closest('.carousel-control-prev') ||
                e.target.closest('.carousel-control-next') ||
                e.target.closest('.carousel-indicators button')) {
                return;
                }
            const cardId = slide.dataset.carouselId;
            const servicePage = new ServicePage(this.parent, cardId);
            servicePage.render();
        });
    });
}
    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.renderCarousel(); 
        this.addSearchListener();
    }
}
