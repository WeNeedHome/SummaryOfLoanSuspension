import React, { FC } from 'react'
import { Dropdown, Menu, Badge, Tabs } from '@weblif/fast-ui'
import { BellOutlined } from '@ant-design/icons'
import styles from './styles/notification.module.less'

interface NotificationProps {
    count: number
}

const NotificationBody = () => (
    <>
        <Tabs
            centered
        >
            <Tabs.TabPane
                tab="消息(4)"
                key="message"
                className={styles.notificationTabs}
            >
                消息内容
            </Tabs.TabPane>
            <Tabs.TabPane
                tab="代办(10)"
                key="task"
                className={styles.notificationTabs}
            >
                代办内容
            </Tabs.TabPane>
        </Tabs><div
            className={styles.notificationBottom}
        >
            <div>清空通知</div>
            <div>查看更多</div>
        </div>
    </>
)

const Notification: FC<NotificationProps> = ({
    count
}) => {
    const overlay = (
        <Menu>
            <NotificationBody />
        </Menu>
    )

    return (
        <Dropdown
            trigger={['click']}
            overlay={overlay}
            placement="bottomLeft"
            overlayClassName={styles.notificationOverlay}
        >
            <div
                className={styles.notificationDropdown}
            >
                <Badge
                    count={count}
                    className={styles.notification}
                >
                    <BellOutlined />
                </Badge>
            </div>
        </Dropdown>
    )
}

export default Notification