import React, { useEffect, useState } from 'react';
import styles from '../lesson1/lesson.module.css';
import clock from '../../../assets/clock.svg';
import lec1 from '../../../assets/IMG-20241109-WA0040.jpg';
import { useNavigate } from 'react-router-dom';
import CommonSection from './CommonSection';
import toast from 'react-hot-toast';

const Lesson3 = () => {
  const [lessonData, setLessonData] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // حالة لتحديد إذا كان المستخدم مسجل دخول أم لا
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // إذا لم يكن هناك accessToken، اعرض رسالة خطأ
      toast.error("قم بتسجيل حساب لتتمكن من مشاهده المحاضرات");
      navigate('/login');
      setIsLoggedIn(false);
      return;
    }
    const fetchLessonData = async () => {
      try {
        const response = await fetch('https://omarroshdy.com/api/v1/hislesson2', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched lesson data:', data);
          setLessonData(data);
        } else {
          console.error('Failed to fetch lesson data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLessonData();
  }, []);

  const handleStartWatching = (lessonId) => {
    const lesson = lessonData.find(item => item.id === lessonId);
    if (lesson) {
      // توجيه المستخدم إلى صفحة الفيديو مع تمرير رابط الفيديو أو embeded
      navigate(`/lesson-video/${lessonId}`, { state: { videoUrl: lesson.video_url, embeded: lesson.embeded } });
    }
  };

  return (
    <>
      <CommonSection title=".مرحبا بكم طلاب الصف الثالث الثانوى فى منصه مستر عمر" />
      <div className="pt-16 pb-16 relative">
        <h2 className={`${styles.main_title} uppercase dark:text-white text-black mx-auto mb-20 border-2 border-black dark:border-white px-5 py-2.5 md:text-2xl text-xl w-fit relative z-10 transition duration-300`}>
          . محاضرات الصف الثالث الثانوى
        </h2>
        <div className={`${styles.lesson} container1`}>
          {lessonData.length > 0 ? (
            lessonData.map((lesson, index) => {
              return (
                <div key={index} className={`${styles.lesson_box} bg-white rounded-md my-4 md:my-16`}>

                  <img className='w-full max-w-full' src={lec1} alt="lesson-img" />

                  <div className="p-5">
                    <div className="flex gap-2">
                      <h3 className="m-0 text-black text-lg md:text-lg">{lesson.duration || '50 minutes'}</h3>
                      <img src={clock} alt="duration" />
                    </div>
                    <div className={styles.lesson_details}>
                      <h3 className="m-0 text-black text-xl md:text-2xl">{lesson.title}</h3>
                      <p className="leading-6 text-[rgba(92,93,95,1)] mt-2 text-base md:text-base">{lesson.description}</p>
                    </div>
                    <div className="text-center border border-[#f26a40] md:p-2 p-1 my-6 bg-[#f26a40] rounded-lg">
                      <button
                        className="text-white no-underline"
                        onClick={() => handleStartWatching(lesson.id)}
                      >
                        ابدأ المشاهدة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-center text-xl py-4'>لا يوجد محاضرات حتى الان</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Lesson3;