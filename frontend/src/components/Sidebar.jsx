import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { dummyProfileData } from './../assets/assets';
import {
  MenuIcon,
  UserIcon,
  XIcon,
  LayoutGridIcon,
  CalendarIcon,
  FileTextIcon,
  DollarSignIcon,
  SettingsIcon,
  ChevronRightIcon,
  LogOutIcon
} from 'lucide-react';

const Sidebar = () => {
  const {pathname} = useLocation()
  const [userName, setUserName] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserName(dummyProfileData.firstName + ' ' + dummyProfileData.lastName)
  },[])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  },[pathname])

  // eslint-disable-next-line no-constant-binary-expression
  const role = "" || "Employee"

  const navItems = [
    {name: 'Dashboard', href: '/dashboard', icon: LayoutGridIcon},
    role === "Admin" ?
    {name: 'Employees', href: '/employees', icon: UserIcon} :
    {name: 'Attendance', href: '/attendance', icon: CalendarIcon},
    {name: 'Leave', href: '/leave', icon: FileTextIcon},
    {name: 'PaySlips', href: '/payslips', icon: DollarSignIcon},
    {name: 'Settings', href: '/settings', icon: SettingsIcon},
  ]

  const handleLogOut = () => {
    window.location.href = '/login'
  }

  const sidebarContent = (
    <>
      {/* brand header */}
      <div className= 'px-5 pt-6 pb-5 border-b border-white/6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <UserIcon className='text-white size-7'/>
          <div>
          <p className='font-semibold text-[13px] text-white tracking-wide'>Employee MS</p>
          <p className='text-[11px] text-slate-500 font-medium'>Management System</p>
        </div>
        </div>
        <button onClick={()=> setMobileOpen(false)}>
          <XIcon size={20} className='lg:hidden text-slate-400 hover:text-white p-1'/>
        </button>
      </div>
      </div>
      {/* user profile */}
      {userName && (<div className='mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0 '>
            <span className='text-slate-400 text-xs font-semibold'>
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='min-w-0'>
            <p className='text-[13px] font-medium text-slate-200 truncate'>{userName}</p>
            <p className='text-[11px] text-slate-500 truncate'>{role === "Admin" ? "Administrator" : "Employee"}</p>
          </div>
        </div>
      </div>)}

      {/* section label */}
        <div className='px-5 pt-5 pb-2'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.12cm] text-slate-500'>Navigation</p>
        </div>
      {/* navigation list */}
        <div className='flex-1 px-3 space-y-0.5 overflow-y-auto'>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link key={item.name} to={item.href} className={`group flex items-center gap-3 px-4 py-2 rounded-lg relative ${isActive ? 'bg-indigo-500/10' : 'hover:bg-white/5'}`}>
                {isActive && <div className='absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-full bg-indigo-500'/>}
                <item.icon className={`w-4.25 h-4.25 shrink-0 ${isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'}`}/>
                <span className='flex-1'>{item.name}</span>
                {isActive && <ChevronRightIcon className='w-3.5 h-3.5 text-indigo-500/50'/>}
              </Link>
            )
          })}
        </div>
      {/* log out */}
      <div className='p-3 border-t border-white/6'>
        <button onClick={handleLogOut} className='flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150'>
          <LogOutIcon/>
          <span>Log out</span>
        </button>
      </div>
    </>
  )
  
  return (
    <>
    <button onClick={()=> setMobileOpen(true)} className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10'>
    <MenuIcon size={20}/>
    </button>

    {mobileOpen && (<div className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={() => setMobileOpen(false)}/>)}

    {/* sidebar content desktop */}
    <aside className='hidden lg:flex flex-col h-full w-65 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4'>
      {sidebarContent}
    </aside>
    {/* sidebar content mobile */}
    <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transition-transform duration-300 
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {sidebarContent}
    </aside>

    </>
  );
};

export default Sidebar;