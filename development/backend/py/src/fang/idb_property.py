from typing import TypedDict, List


class IDBProperty(TypedDict):
    _id: str  # 我们自己的编码

    # 代码
    bbs_id: str  # 搜索代码
    newCode: str  # 房天下的新代码标识，与我们目前用的不一样，可以无视，例如：1210125944

    # 项目名称
    search_shortname: str  # 简短的搜索名称
    nicknames: str  # 另名，逗号分隔
    esf_nicknames: str  # 另名（最详细的名字），逗号分隔
    ProjName: str  # 楼盘名称
    esf_ProjName: str  # 同上
    ProjDesc: str  # 楼盘描述

    # url
    update_time: str  # 更新时间
    domain: str  # 主页
    wapurl: str  # 手机网址地址
    outdoor_pic_url: str
    traffic_pic_url: str
    lprobot: str
    xf_detail: str
    xf_tel: str

    # 区位地址
    city: str  # 城市名称
    District: str  # 区
    esf_District: str  # 同上
    ComArea: str  # 不知道是啥，长兴岛
    esf_ComArea: str  # 同上

    # 具体地址
    Address: str  # 地址
    EsfAddress: str  # 同上
    Round_oracle: str  # 几环

    # 经纬度
    baidu_coord_x: str  # 经度
    baidu_coord_y: str  # 维度

    # 开发商和物业
    developerAll: str  # 开发商（最重要的信息），以英文逗号分隔开来的
    manager: str  # 物业管理公司
    telephone: str  # 电话

    # 装修
    FixStatus: str  # 装修状态
    FinishDate: str  # 完成日
    esf_FinishDate_s: str  # 同上
    FinishDate_s: str  # 完成月份

    # 销售
    salestatus: str  # 销售状态
    priceDate: str  # 报价日
    SaleAddress: str  # 销售地址
    SaleDate: str

    operastion_en: str  # 楼盘类型（是房天下拼错）
    LivinDate: List[str]  # 居住日期
