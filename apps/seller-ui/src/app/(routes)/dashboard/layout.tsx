import SideBarWrapper from 'apps/seller-ui/src/shared/modules/sidebar/sidebar'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex h-full bg-black min-h-screen'>
        {/* Sidebar */}
        <aside className='w-[280px] min-w-[250px] max-w-[300px] border-4 border-r-slate-800 text-white p-4'>
            <div className="sticky top-0">
                <SideBarWrapper/>
            </div>
        </aside>
        {/* Main content area */}
        <main></main>
        {children}
    </div>
  )
}

export default layout