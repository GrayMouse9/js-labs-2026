import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {TrajectoryComponent} from "../../components/trajectory/index.js";
import {ajax} from "../../modules/ajax.js";
import {trajectoryUrls} from "../../modules/trajectoryUrls.js";

export class TrajectoryPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = parseInt(id);
    }

    getData() {
        ajax.get(trajectoryUrls.getTrajectoryById(this.id), (data) => {
            this.renderData(data);
        });
    }

    get pageRoot() {
        return document.getElementById('trajectory-page');
    }

    getHTML() {
        return `<div id="trajectory-page" class="p-4"></div>`;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    renderData(data) {
        if (!data) {
            console.error('Ошибка: данные траектории не получены');
            return;
        }
        const trajectoryComponent = new TrajectoryComponent(this.pageRoot);
        trajectoryComponent.render(data);
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        this.getData();
    }
}
