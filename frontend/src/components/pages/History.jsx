import React, {useEffect} from 'react';
import Store from "../../store/store";
import {observer} from "mobx-react";
import {Loader} from "../Loader/Loader";
import {Row} from "../Row/Row";
import {runInAction} from "mobx";


export const History = observer(() => {
    let store = Store;
    const {groupedEvents} = store;
    const groups = Object.keys(groupedEvents || {});

    useEffect(() => {
        return () => store = null;
    }, []);


    return (
        <div>
            {store.loading && <Loader />}
            {!!store.events && (
                <>
                    <div className={'event-group'}>
                        <Row header />
                    </div>
                    {
                        groups.map(group => <div key={group} className={'event-group'}>
                            {
                                groupedEvents[group]
                                    .slice(0,15)
                                    .map((evt, i) => <Row
                                        key={evt.id}
                                        eventType={!i ? evt.resource : ''}
                                        details={
                                            store.resources && store.resources[`${evt.resource}/${evt.id}`].details
                                        }
                                        code={
                                            store.resources && store.resources[`${evt.resource}/${evt.id}`].values &&
                                            store.resources[`${evt.resource}/${evt.id}`].values.join(', ')}
                                        date={evt.date}
                                    />)
                            }
                        </div>
                        )
                    }
                </>
            )}
        </div>
    );
});

