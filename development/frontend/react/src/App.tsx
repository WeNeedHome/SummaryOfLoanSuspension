import {Breadcrumb, Layout, Menu} from "antd";
import {useState} from "react";
import MenuItem from "antd/es/menu/MenuItem";
import {ItemType} from "antd/es/menu/hooks/useItems";

const {Header, Content, Footer} = Layout;


const menus: ItemType[] = [
    {label: '新增停贷项目', key: 'item-1'}, // 菜单项务必填写 key
    {label: '地图可视化', key: 'item-2'},
];


export const App = () => {

    const [curMenu, setCurMenu] = useState(0)

    return (
        <Layout className="layout" style={{height: '100vh'}}>
            <Header>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={menus}
                />
            </Header>

            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">Content</div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>)
}

export default App