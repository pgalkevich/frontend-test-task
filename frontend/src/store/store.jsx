import {makeObservable, observable, action, runInAction, computed} from "mobx"


class Store {
    events = null;
    resources = null;
    loading = false;

    constructor() {
        makeObservable(this, {
            events: observable,
            resources: observable,
            loading: observable,
            fetchEvents: action,
            fetchResources: action,
            groupedEvents: computed
        });
        this.fetchEvents();
    }

    fetchEvents = () => {
        runInAction(() => this.loading = true);
        fetch('http://localhost:5010/events', {method: 'POST'})
            .then(response => response.json())
            .then(data => data.items.map(evt => {
                evt.resourceId = `${evt.resource}/${evt.id}`
                evt.date = new Date(evt.date)
                return evt;
            }))
            .then(events => runInAction(() => this.events = events))
            .then(() => this.fetchResources())
            .catch(err => console.error(err.message))
            .finally(() => runInAction(() => this.loading = false));
    }

    fetchResources = () => {
        const data = { ids: this.events.map(evt => evt.resourceId)}
        fetch('http://localhost:5010/resources', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                const dataMap = {};
                data.items.forEach(res => dataMap[res.id] = {...res})
                runInAction(() => this.resources = dataMap)
            })
            .catch(err => console.error(err.message));
    }

    get groupedEvents() {
        if (!this.events) {
            return null;
        }

        const data = this.events.slice().sort((e1, e2) => e1.date - e2.date)
            .reduce((acc, event) => {
                const fieldName = event.name;
                if (!acc[fieldName]) {
                    acc[fieldName] = [];
                }

                acc[fieldName].push(event);
                return acc;
            }, {});

        return data;
    }
}

export default new Store();