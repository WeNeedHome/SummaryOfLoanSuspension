import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import 'antd/dist/antd.variable.min.css'
import 'leaflet/dist/leaflet.css'
import './styles/global.less'

const Layout = () => {
    return (
        <Suspense fallback={<div />}>
            <Outlet />
        </Suspense>
    )
}

export default Layout