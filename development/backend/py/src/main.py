import json
import os.path
from argparse import ArgumentParser

from const import DATA_GEN_DETAILED_DIR
from fang.fang import Fang
from fang.property_ import fetch_property_id, get_property_name_robust
from supports.log import logger
from supports.utils import get_city_code_robust


def do_fetch_id(args):
    print('running fetch-id')
    property_id = fetch_property_id(
        city=get_city_code_robust(args.city),
        property_name=get_property_name_robust(args.prop)
    )
    print("result: ", property_id)


def do_fetch_detail(args):
    logger.info('running fetch-detail')
    if not args.id:
        assert args.prop, "楼盘id 和 名称必须要有一个"
        args.id = fetch_property_id(
            city=get_city_code_robust(args.city),
            property_name=get_property_name_robust(args.prop)
        )
    fang = Fang(property_id=args.id, city_name=args.city)
    item = fang.fetch_detail()
    if args.dump:
        fn = f'{args.prop}.json'
        fd = os.path.join(DATA_GEN_DETAILED_DIR, args.city)
        if not os.path.exists(fd):
            os.makedirs(fd, exist_ok=True)
        fp = os.path.join(fd, fn)
        with open(fp, 'w') as f:
            json.dump(item, f, ensure_ascii=False, indent=2)
            logger.info(f'dumped data into file://{fp}')
    logger.info("开发商：" + item["developerAll"])


parser = ArgumentParser(description='房天下数据系统')
subparsers = parser.add_subparsers()

parser_fetch_id = subparsers.add_parser(
    'fetch-id',
    help='从房天下html页面搜索指定城市的指定小区名字，从而获取该小区在房天下系统里的id'
)
parser_fetch_id.add_argument('-c', '--city', help='城市名称或者代码，例如"上海"或者"sh"')
parser_fetch_id.add_argument('-p', '--prop', help='楼盘名称，例如"泰禾大城小院"')
parser_fetch_id.set_defaults(func=do_fetch_id)

parser_fetch_detail = subparsers.add_parser(
    'fetch-detail',
    help='基于房天下的楼盘id获得楼盘详细信息，当有楼盘id时使用id，没有id时使用楼盘名称，并调用fetch-id接口'
)
parser_fetch_detail.add_argument('-c', '--city', help='城市名称或者代码，例如"上海"或者"sh"')
parser_fetch_detail.add_argument('-i', '--id', help='楼盘id，例如"1210125944"')
parser_fetch_detail.add_argument('-p', '--prop', help='楼盘名称，例如"泰禾大城小院"')
parser_fetch_detail.add_argument('-d', '--dump', action='store_false', help='存储详情结果（默认开启）')
parser_fetch_detail.set_defaults(func=do_fetch_detail)

args = parser.parse_args()
args.func(args)
