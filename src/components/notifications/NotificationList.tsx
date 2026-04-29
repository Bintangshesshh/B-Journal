"use client";

import React, { useState } from 'react';

type FilterType = 'ALL' | 'LIKES' | 'COMMENTS' | 'ALERTS';

export default function NotificationList() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const notifications = [
    {
      id: 1,
      type: 'like',
      read: false,
      message: '@URBAN_EXPLORER LIKED YOUR PHOTO',
      time: '2M AGO',
      logId: '884',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxkGS-BRavlYZQG0-0ZRdE9MGofA0_GpcaAKL4aKtN4eagyHjZrRRDUrazssVMmgBwnygJoOsujMctmv6NBaxjsVGKdC5IxUFA2LV10OPFdSuZiIsqRbzRC03TTbDsQgWPiJzxp1cnnttiszYXz6tuxMUxJmNpe69YzxT-g_HwVoiJg0sph4TaVOoijNP5QWZ58Brsp6Bc4loVSQta1vmEdXlCq_MFT6RkEBpXB1fbJ5UYtSTG6hm6Rfvhc0-N0PMtIslfeBWutHQ',
      targetImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASh_S7Yp8MC-K2wVn-SibowARTI2U6VUMTecSalsb8-IaU6d80VR1Dz0TKjjQIjZUwh-EQXJsv8Ez08syYQSGxKdsJScwuiXGWY7jxdGPHlonB5USYmlMqyglGxp_mI0ioRmT1d8dCmvZxECx7fx4bjTqE0Hjuv9v4NLTqmqBSs993cdakJ8sfJH-9dWpwminXVCLjlvAWCiAlyVIm4pbvDKN70YKTqMZhGar9i6wNc4KU6LMajLOSjFI5cHdHhCUrzODp9XttoqU'
    },
    {
      id: 2,
      type: 'comment',
      read: true,
      message: '@CONCRETE_POET COMMENTED: "STARK."',
      time: '15M AGO',
      logId: '721',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9tFmk-0EiSWNsKLwblgN4l9s5qsFzTXtqBV5q1kADJFL9SeY8FgfwyNsqtj-pLALdS3F6ZlIkXK8tt382XJrWkOETnBHLUjeVvn6z6825sgkfjdf9z6JE8VyjFJJj2NMDeV9rL_OoRNizlOYzzJRkx7lJBvek1a7CyFGLqJGMZSgIl3Kx5jr-nrAnUWkYp8FmpE6PMsZ4MlLNSXQPu94ZiN6onmJlc4tYs9-NvbvYZxHCK4mFVT0cd8ymLjJzruhEsylgn9C0WW8',
      targetImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnCR3eW0UEaksLVw8xBgSYv8DsAb_QRnBcMsAvDRHLbchO4FuyRzjXR6vVS9417zr3p7rtU1y9ixoplfmM1xT6zskudHo6JX-878Q85AJNCa_K2L7P4hv_GFUTyeZngilXDIOkxDmgfHur7uFO-1Rfso-_Kbc29CwqA_6aMQyv7gZXzbMnvgccBhSCBGM3LGsxZxMiedFX2jbNxo2G6fgTurBviBGGO-Pv0fU2NC1ICztUVeVghdgft2hGskjGCgsUlIUZyDq60YA'
    },
    {
      id: 3,
      type: 'alert',
      read: false,
      message: "ALBUM: 'INDUSTRIAL_GREY' REACHED CAPACITY",
      time: '1H AGO',
      logId: '550',
      isSystem: true
    },
    {
      id: 4,
      type: 'like',
      read: true,
      message: '@VOID_SEEKER REPOSTED YOUR ENTRY',
      time: '3H AGO',
      logId: '412',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrFZFDl0Qy47-j7E4o52CiivSUp8OoYd_zkIEK7uzogU_6nmKp0pAIBnIF4fI80PhrVdZUWEw1aun1rom9QIBYWA7WbFj51aVMtWdocoLQwk8gWrLlmTnPW1VGgLKN-RLYqyfA3FXjcAwmZUNV-ZVz9quDoysOuM6pLGRmwP1qUsC6Zy7bMpqi7Ri-5dDxhVNkzdDndEk2SpwXPHJK0-O7xmPZQvhps8BT1KcwlTPc-Hs9Rm0mbaUe-bOVzMbe5Qa61vpThvYzk3M',
      targetImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-IlmTP5l8eziQoUIWrsY8zP2Xozwx3rBqPaVH5tes9C1zNxpc0w-HhT8Px8r1HRy9iBrjxW-Vo6PdkN0ZoA90HInoAdlRrSEI0F7J7RvPTCG5qMIGxkPrzFIQUKy-0j95B82sJeT17Y-6vIO35sD872XruxMswz0LfjrW1z7TS23me29qPZEFnfbBKV94k9aNFydqvydEAKn0W8_v1CJtP8Hb_p9mcfRzC4DTAzlPIjK6ku8myhXvlM8cQEwQOKZGHgXLSqKV4IU'
    }
  ];

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LIKES') return notif.type === 'like';
    if (activeFilter === 'COMMENTS') return notif.type === 'comment';
    if (activeFilter === 'ALERTS') return notif.type === 'alert';
    return true;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {(['ALL', 'LIKES', 'COMMENTS', 'ALERTS'] as FilterType[]).map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`font-black text-sm md:text-xl px-6 md:px-8 py-3 border-4 border-pitch-black shadow-[6px_6px_0px_0px_#000000] hover:-translate-y-1 transition-transform uppercase
              ${activeFilter === filter 
                ? 'bg-liverpool-red text-white' 
                : 'bg-white text-pitch-black hover:bg-stadium-grey'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-6 md:space-y-8 relative">
        {filteredNotifications.length === 0 && (
           <div className="bg-white border-4 border-pitch-black shadow-[8px_8px_0px_0px_#000000] p-8 text-center text-xl font-bold uppercase ink-bleed-text">
             NO.NOTIFICATIONS.FOUND_IN_THIS_CATEGORY
           </div>
        )}

        {filteredNotifications.map((notif) => (
          <div 
            key={notif.id}
            className={`border-4 border-black shadow-[8px_8px_0px_0px_#000000] md:shadow-[12px_12px_0px_0px_#000000] flex flex-col md:flex-row items-stretch md:items-center p-4 md:p-6 relative group hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-75 
              ${notif.isSystem ? 'bg-[#f2d3d1]' : 'bg-white'} 
              ${!notif.read && !notif.isSystem ? 'overflow-hidden' : ''}`}
          >
            {/* Unread Indicator */}
            {!notif.read && (
              <div className={`absolute left-0 top-0 bottom-0 w-4 border-r-4 border-black hidden md:block ${notif.isSystem ? 'bg-pitch-black' : 'bg-liverpool-red'}`}></div>
            )}
            
            <div className={`md:ml-6 flex items-center gap-4 md:gap-6 flex-1 ${!notif.read ? 'border-l-8 border-liverpool-red pl-4 md:border-none md:pl-0' : ''}`}>
              {!notif.isSystem ? (
                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-black overflow-hidden bg-black halftone flex-shrink-0">
                  <img className="w-full h-full object-cover grayscale" src={notif.userAvatar} alt="user avatar" />
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-black bg-black flex flex-shrink-0 items-center justify-center">
                  <span className="material-symbols-outlined text-white text-3xl md:text-4xl">warning</span>
                </div>
              )}

              <div className="flex-1 min-w-0 pr-4 md:pr-0">
                <p className={`text-md md:text-xl font-black uppercase tracking-tighter ink-bleed-text truncate md:whitespace-normal ${notif.isSystem ? 'text-liverpool-red' : 'text-pitch-black'}`}>
                  {notif.message}
                </p>
                <p className="font-['Plus_Jakarta_Sans'] text-xs md:text-sm font-bold opacity-60 uppercase mt-1 tracking-wider">
                  {notif.time} // LOG_ID: {notif.logId}
                </p>
              </div>
            </div>

            {notif.targetImg && (
              <div className="hidden md:block w-20 h-20 md:w-24 md:h-24 border-4 border-black overflow-hidden halftone ml-4 flex-shrink-0">
                <img className="w-full h-full object-cover grayscale" src={notif.targetImg} alt="target" />
              </div>
            )}

            {/* Random Tape */}
            {notif.id === 1 && <div className="absolute bg-zinc-500 opacity-80 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] -top-2 -right-4 w-16 h-6 rotate-[15deg]"></div>}
            {notif.id === 3 && <div className="absolute bg-zinc-500 opacity-60 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)] -bottom-2 left-1/4 w-32 h-8 rotate-[-3deg]"></div>}
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="mt-12 md:mt-24 text-center">
        <button className="bg-liverpool-red text-white border-4 border-pitch-black py-4 md:py-6 px-8 md:px-12 text-lg md:text-2xl font-black uppercase shadow-[8px_8px_0px_#000000] md:shadow-[12px_12px_0px_#000000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all active:scale-95 group">
          <span className="ink-bleed-text">LOAD.OLDER.LOGS</span>
        </button>
        <footer className="mt-8 md:mt-12 text-[10px] md:text-xs font-black opacity-30 uppercase tracking-[0.3em] md:tracking-[0.5em] pb-12 break-words">
          B-JOURNAL // SESSION.REF: 992-X-KLA // NO.RETENTION.POLICY
        </footer>
      </div>
    </>
  );
}