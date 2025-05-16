'use client'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { RiCloseLine } from '@remixicon/react'
import Modal from '@/app/components/base/modal'
import type { LangGeniusVersionResponse } from '@/models/common'
import { noop } from 'lodash-es'

type IAccountSettingProps = {
  langeniusVersionInfo: LangGeniusVersionResponse
  onCancel: () => void
}

export default function AccountAbout({
  langeniusVersionInfo,
  onCancel,
}: IAccountSettingProps) {
  const { t } = useTranslation()
  const isLatest = langeniusVersionInfo.current_version === langeniusVersionInfo.latest_version

  return (
    <Modal
      isShow
      onClose={noop}
      className='!w-[480px] !max-w-[480px] !px-6 !py-4'
    >
      <div>
        <div className='absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center' onClick={onCancel}>
          <RiCloseLine className='h-4 w-4 text-text-tertiary' />
        </div>
        <div>
          <LogoSite className='mx-auto mb-2' />
          <div className='mb-3 text-center text-xs font-normal text-text-tertiary'>Version {langeniusVersionInfo?.current_version}</div>
          <div className='mb-4 text-center text-xs font-normal text-text-secondary'>
            <div>© {dayjs().year()} 南京伊克罗德信息科技有限公司</div>
            {/* <div className='text-text-accent'>
              {
                IS_CE_EDITION
                  ? <Link href={'https://github.com/langgenius/dify/blob/main/LICENSE'} target='_blank' rel='noopener noreferrer'>Open Source License</Link>
                  : <>
                    <Link href='https://dify.ai/privacy' target='_blank' rel='noopener noreferrer'>Privacy Policy</Link>,&nbsp;
                    <Link href='https://dify.ai/terms' target='_blank' rel='noopener noreferrer'>Terms of Service</Link>
                  </>
              }
            </div> */}
          </div>
        </div>
        <div className='-mx-8 mb-4 h-[0.5px] bg-divider-regular' />
        {/* <div className='flex items-center justify-between'>
          <div className='text-xs font-medium text-text-primary'>
            {
              isLatest
                ? t('common.about.latestAvailable', { version: langeniusVersionInfo.latest_version })
                : t('common.about.nowAvailable', { version: langeniusVersionInfo.latest_version })
            }
          </div>
          <div className='flex items-center'>
            <Button className='mr-2' size='small'>
              <Link
                href={'https://github.com/langgenius/dify/releases'}
                target='_blank' rel='noopener noreferrer'
              >
                {t('common.about.changeLog')}
              </Link>
            </Button>
            {
              !isLatest && !IS_CE_EDITION && (
                <Button variant='primary' size='small'>
                  <Link
                    href={langeniusVersionInfo.release_notes}
                    target='_blank' rel='noopener noreferrer'
                  >
                    {t('common.about.updateNow')}
                  </Link>
                </Button>
              )
            }
          </div>
        </div> */}
      </div>
    </Modal>
  )
}
