document.addEventListener('DOMContentLoaded', function() {
    // 1. ระบบ Smooth Scrolling และ Active Link
    // เพิ่มประสิทธิภาพการตรวจจับตำแหน่ง Section ให้แม่นยำขึ้น
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.sidebar nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ตรวจสอบตำแหน่ง Scroll เพื่อเปลี่ยนสถานะ Active ของเมนู
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // ปรับ offset 150px เพื่อให้เมนูเปลี่ยนก่อนถึงขอบบนเล็กน้อย
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 2. ระบบป้องกันการดาวน์โหลดแบบครอบคลุม (Security)
    // ป้องกันการคลิกขวาที่รูปภาพทั้งหมดในเว็บไซต์
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    }, false);

    // ป้องกันการลากรูปภาพ (Drag and Drop) เพื่อบันทึกไฟล์
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
        }, false);
        
        // เพิ่มเติม: ป้องกันการสัมผัสค้างบนมือถือเพื่อเซฟรูป
        img.style.webkitTouchCallout = 'none';
        img.style.userSelect = 'none';
    });

    // ป้องกันคีย์ลัดในการเซฟหน้าเว็บและดูซอร์สโค้ด
    document.addEventListener('keydown', function(e) {
        // Ctrl+S (Save), Ctrl+P (Print), Ctrl+U (View Source), Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'u') || 
           (e.ctrlKey && e.shiftKey && e.key === 'i')) {
            e.preventDefault();
            return false;
        }
    });

    // 3. ระบบจัดการใบเซอร์ (Certificates)
    // เนื่องจากคุณต้องการให้โชว์ภาพใบเซอร์เลยและห้ามดาวน์โหลด 
    // เราจะเพิ่มเอฟเฟกต์ Hover เล็กน้อยเพื่อให้รู้ว่าดูได้อย่างเดียว
    const certCards = document.querySelectorAll('.no-download');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.cursor = 'default';
        });
    });

    // ส่วนการเปิด PDF (ถ้าคุณยังต้องการให้มีปุ่ม View Certificate ในบางจุด)
    const pdfModal = document.getElementById('pdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const closeBtn = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.view-pdf');

    if (pdfModal && pdfViewer) {
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const pdfUrl = this.getAttribute('href');
                pdfViewer.src = pdfUrl + '#toolbar=0&navpanes=0';
                pdfModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; 
            });
        });

        if (closeBtn) {
            closeBtn.onclick = function() {
                pdfModal.style.display = 'none';
                pdfViewer.src = '';
                document.body.style.overflow = 'auto';
            };
        }

        window.onclick = function(event) {
            if (event.target == pdfModal) {
                pdfModal.style.display = 'none';
                pdfViewer.src = '';
                document.body.style.overflow = 'auto';
            }
        };
    }
    // 4. ระบบคำนวณอายุอัตโนมัติจากวันเกิด
    const ageElement = document.getElementById('user-age');
    if (ageElement) {
        // วันเกิด: 21 มีนาคม 2546 (ค.ศ. 2003 / เดือนมีนาคม คือ index 2)
        const birthDate = new Date(2003, 2, 21);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // หากยังไม่ถึงเดือนเกิด หรืออยู่ในเดือนเกิดแต่วันที่ยังไม่ถึง ให้ลดอายุลง 1 ปี
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        ageElement.textContent = age;
    }
});