/**
 * output app and system info
 */

import {Icon, Modal, Tabs, Button, Tag} from 'antd'
import Link from '../common/external-link'
import _ from 'lodash'

const {prefix} = window
const e = prefix('control')
const m = prefix('menu')

const {TabPane} = Tabs

export default function({
  onCheckUpdate,
  onCheckUpdating
}) {
  const {getGlobal} = window
  let {
    name,
    description,
    devDependencies,
    dependencies,
    author: {
      name: authorName,
      email,
      url: authorUrl
    },
    homepage,
    repository: {
      url
    },
    version: packVer
  } = getGlobal('packInfo')
  let cdn = window.location.origin
  let version = 'v' + packVer
  let link = url.replace('git+', '').replace('.git', '')
  let os = getGlobal('os')
  let env = getGlobal('env')
  let deps = {
    ...devDependencies,
    ...dependencies
  }
  let bugReportLink = link + '/issues'
  let logoPath = cdn + '/_bc/electerm-resource/res/imgs/' +
    (Math.random() > 0.5 ? 'electerm-round-128x128.png' : 'electerm.png')
  Modal.info({
    title: `${m('about')} ` + name,
    width: window.innerWidth - 100,
    maskClosable: true,
    okText: 'OK',
    content: (
      <div className="about-wrap">
        <Tabs defaultActiveKey="1">
          <TabPane tab={m('about')} key="1">
            <div className="pd2y aligncenter">
              <img src={logoPath} className="iblock mwm-100" />
            </div>
            <h1 className="mg2b font50">
              <span className="iblock mg1r">{name}</span>
              <Tag color="#08c">{version}</Tag>
            </h1>
            <p className="mg1b">{description}</p>
            <p className="mg1b">
              <b className="mg1r">{e('author')}:</b>
              <Link to={authorUrl} className="mg1l">
                {authorName} ({email})
              </Link>
            </p>
            <p className="mg1b">
              <b>{e('homepage')}:</b>
              <Link to={homepage} className="mg1l">
                <Icon type="home" /> {homepage}
              </Link>
            </p>
            <p className="mg1b">
              <b className="mg1r">{e('download')}:</b>
              <Link to={homepage} className="mg1l">
                <Icon type="github" /> {homepage}
              </Link>
            </p>
            <p className="mg1b">
              <b className="mg1r">github:</b>
              <Link to={link} className="mg1l">
                <Icon type="github" /> {link}
              </Link>
            </p>
            <p className="mg1b">
              <b className="mg1r">{e('bugReport')}:</b>
              <Link to={bugReportLink} className="mg1l">
                <Icon type="github" /> {bugReportLink}
              </Link>
            </p>
            <p className="mg1y">
              <Button
                type="primary"
                loading={onCheckUpdating}
                onClick={onCheckUpdate}
              >
                {e('checkForUpdate')}
              </Button>
            </p>
          </TabPane>
          <TabPane tab={e('userTips')} key="0">
            <ul>
              <li className="pd1b">
                <span className="bold color-red">double click</span> a ssh tab will duplicate a same tab, and enter same path as original tab(limited support)
              </li>
              <li className="pd1b">
                <span className="bold color-red">double click</span> blank area of tab bar will open a new ssh terminal too
              </li>
              <li className="pd1b">
                <span className="bold color-red">right click</span> a ssh tab you can open context menu, from context menu there are <span className="bold color-red">close other tabs</span>, <span className="bold color-red">close tabs on the right</span>, and more function
              </li>
              <li className="pd1b">
                by default, <span className="bold color-red">Ctrl + 2</span> will bring electerm window to front, hotkey can be set in <span className="bold color-red">setting</span> menu
              </li>
            </ul>
          </TabPane>
          <TabPane tab={e('dependencies')} key="4">
            {
              Object.keys(deps).map((k, i) => {
                let v = deps[k]
                return (
                  <div className="pd1b" key={i + '_dp_' + k}>
                    <b className="bold">{k}</b>:
                    <span className="mg1l">
                      {v}
                    </span>
                  </div>
                )
              })
            }
          </TabPane>
          <TabPane tab={e('env')} key="3">
            {
              Object.keys(env).map((k, i) => {
                let v = env[k]
                return (
                  <div className="pd1b" key={i + '_env_' + k}>
                    <b className="bold">{k}</b>:
                    <span className="mg1l">
                      {v}
                    </span>
                  </div>
                )
              })
            }
            }
          </TabPane>
          <TabPane tab={e('os')} key="2">
            {
              Object.keys(os).map((k, i) => {
                let vf = os[k]
                if (!_.isFunction(vf)) {
                  return null
                }
                let v = JSON.stringify(vf(), null, 2)
                return (
                  <div className="pd1b" key={i + '_os_' + k}>
                    <b className="bold">{k}</b>:
                    <span className="mg1l">
                      {v}
                    </span>
                  </div>
                )
              })
            }
          </TabPane>
        </Tabs>

      </div>
    )
  })
}
