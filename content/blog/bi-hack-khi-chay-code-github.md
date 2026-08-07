---
title: "Phân tích trường hợp bị hack khi chạy code từ GitHub"
snippet: "Các bạn lập trình viên hãy cảnh giác trước khi chạy code được tải từ GitHub về máy. Nếu có thể, hãy dùng các môi trường cô lập như Windows Sandbox."
category: "Security"
tags:
  - "Security"
  - "GitHub"
  - "Malware"
  - "Python"
  - "Windows"
  - "CyberSecurity"
  - "J2TEAM"
  - "DevOps"
date: "15 Nov 2024"
author:
  name: "Juno_okyo"
  avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL3yrcwWnlPeCOG6T3jtIoy42wtnpAvvPmo4s77w6SqVUi9xkSQam983z330vy7o-zOD77wK3qlMNIw5VhDcBAqMyJvtkcODRCf7FXXfsoCse2BRsdTXAPByodpi3C9zI/w40-h40-p-k-no-nu/juno-okyo-logo.png"
  bio: "Leader at J2TEAM. Website: https://j2team.dev/"
readTime: "7 min read"
comments: 12
image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
pinned: true
---

Mấy hôm trước trên J2TEAM Community có một bài viết đề cập đến vấn đề “[bị hack khi chạy code clone từ GitHub](https://www.facebook.com/groups/j2team.community/posts/2535166133482158/)”. Bài viết nhanh chóng nhận được sự chú ý của thành viên trong nhóm.

![](https://blogger.googleusercontent.com/img/a/AVvXsEioLO-oj5vqy2zFqRRXTelxPMPwQCVA01zE8IDxOBvGi0yuZ2TdUe3TAHw8IpSXV76vpnWuVlLE_nL__FzJbquhh5UHxV-eXamTqi5kMAd-3Xp7OQfPvkoPsqvmU3e4S41ksuYyakbeNm9yQqDNC3bNNyTUBSPhQreyhMB6zEJFaMojXwjYTyE5Jm8Xe1XA=w640-h213)

Tóm tắt diễn biến:

- Kẻ tấn công liên hệ qua LinkedIn, giới thiệu một công việc liên quan đến hỗ trợ phát triển dự án
- Sau khi đồng ý, bạn ấy được thêm vào một repository private trên GitHub
- Khi clone mã nguồn về và chạy lệnh khởi động, quá trình tấn công sẽ được kích hoạt

Phần dưới đây là những gì mình tìm hiểu thêm được về hình thức tấn công này.

## Ai sẽ là mục tiêu của kẻ tấn công?

Bài viết trên J2TEAM Community không phải là trường hợp đầu tiên. Bằng một vài từ khóa tìm kiếm trên Google, mình tìm được bài viết sau trên LinkedIn:

![](https://blogger.googleusercontent.com/img/a/AVvXsEj8ZB1o2sFVQgptTD-UQpWbN0bnBRvxbskQRdKykGF-onMwJaRduqEqLRPDofzLAx7Cx2J_LXoJb6gVPtyKeJzRuZjO9ePN8Hykm-mnDzTqTWu8dkkqU4uYMQSM4XpzieRrx1YcSfUCksSkSF2-DYm0uMBRVcnCU0B87cpjhAxT_o5XrZrtaP6Zr0sGdJVD=w592-h640)

Và một bài trên Reddit:

![](https://blogger.googleusercontent.com/img/a/AVvXsEinb1Eeb9IQxiQAWSKB2vh5lRw7EorfZhmXbY_ggodVzZwjNSb04EJmST2wMMUO98XQHW1cYRA1P_Tcs_el-4z65RExsn33r0Iv_ndOJW6drdcwQP2mIPXxCXXRDHCRyOsa-7etb1VbuOKmlD5jp80SB9YdEC99QnWcuUu9AABOOv2JE3ReekboJu3-ZBZh=w640-h396)

Dựa vào những bài viết ở trên, mình nhận thấy một số đặc điểm chung:

- Mục tiêu chính là **những lập trình viên làm việc trong lĩnh vực web3/blockchain**
- Nạn nhân được cấp quyền vào một private repo trên GitHub
- Nạn nhân được thuyết phục chạy lệnh khởi động dự án hoặc build trên máy tính cá nhân

Bài viết từ Reddit cho thấy những dấu hiệu đặc trưng của Stealer - loại mã độc chuyên đánh cắp thông tin. Một vụ việc nổi tiếng gần đây bạn có thể biết là Stealer giả mạo game WuKong.

Thông tin phổ biến nhất mà Stealer thu thập là tài khoản và mật khẩu được lưu trữ trên trình duyệt. Với đối tượng là lập trình viên web3, mục tiêu chính của kẻ tấn công rất có thể là đánh cắp thông tin ví tiền điện tử, chẳng hạn như MetaMask.

## Kỹ thuật tấn công

### Tấn công thông qua Git Hook

Git hook là các tập lệnh tùy chỉnh được kích hoạt khi thực hiện các lệnh Git như commit, rebase, merge, push,... Mặc định, các hook này được lưu trong thư mục .git/hooks. Kẻ tấn công có thể lợi dụng Git hook để thực thi mã độc mỗi khi người dùng thực hiện một lệnh Git. Đây là một ví dụ.

Mặc định thì thư mục .git sẽ được đặt thuộc tính ẩn (Hidden), nên nếu bạn không cài đặt cho máy tính hiển thị thư mục ẩn thì sẽ không để ý đến nó.

![](https://blogger.googleusercontent.com/img/a/AVvXsEicWjlDr3GOR16xvL68I-dd_tBdPGkv5xzuarLedKj1JurJNqvIPAIWLiyd1CNja5QXIBLmQcypxuwa-4885EjGHIduv3Rxnd3z-6Zbzx93ZhEvB6LFgNXFAShJFTXhV6hvdVlX3IJ8nhrtCiuNwncFhDDQqsyXS-e_mIV4L39P2N_K1Ba5qpfbK99Y-3cD=w640-h489)

Tuy nhiên, trong các trường hợp nạn nhân bị tấn công khi chạy lệnh như start hoặc build, các lệnh này thuộc về NPM chứ không liên quan trực tiếp đến Git. Vì vậy, chúng ta hãy đến với kiểu tấn công tiếp theo. Nhưng hãy nhớ: **Bạn cũng cần cảnh giác với Git Hook!!!**

### Tấn công thông qua NPM Script

Với các repo GitHub ở trên, điểm chung là sẽ có 1 file package.json như này:

![](https://blogger.googleusercontent.com/img/a/AVvXsEhT1VRvl4v1deK5AXl2DV18qhivZerDdAUkJoJyiCOktGTfDriYJmkiK0q2iZ65gpqz6ThjsA6y6we3VDWkj2ZC51zUxmJrtcTrYGIDowfPOrkVYirxaYeAA-Ii_qnOURdhK9uQ0zrkFwZB6dN6JrHzgOvWgDjgcfBInuijplvGlyog037LNIhSHvKoYv-e=w640-h234)

package.json là file kê khai thông tin ứng dụng thường thấy trong các ứng dụng NodeJS. Nó cho biết các thông tin cơ bản như tên, phiên bản cho đến những thông tin khác như thư viện phụ thuộc mà ứng dụng của bạn cần sử dụng. Bạn cũng có thể đăng ký các lệnh có thể sử dụng thông qua mục "scripts" trong file này.

Ví dụ, đây là một lệnh độc hại được giả mạo lệnh build:

```json
{
  "scripts": {
    "start": "node app.js",
    "build": "rm -rf / && echo 'Malicious script executed!'"
  }
}
```

Nhưng thế này thì lộ liễu quá! Kẻ tấn công thường sẽ ẩn trong file JS và áp dụng các kỹ thuật obfuscation.

> Trong phát triển phần mềm, obfuscation (làm rối mã) là hành động tạo ra mã nguồn hoặc mã máy mà con người hoặc máy tính khó hiểu được. Giống như việc làm rối trong ngôn ngữ tự nhiên, nó có thể sử dụng các biểu thức vòng vo không cần thiết để cấu thành các câu lệnh.
>
> Lập trình viên có thể cố ý làm rối mã để che giấu mục đích của nó (bảo mật thông qua sự mơ hồ), logic của nó, hoặc các giá trị ngầm định được nhúng bên trong. Mục đích chính là ngăn chặn việc can thiệp, làm nản lòng các nỗ lực dịch ngược (reverse engineering), hoặc thậm chí tạo ra một câu đố hoặc thử thách mang tính giải trí cho người đọc mã nguồn.

Dựa trên mã nguồn của repo GitHub mà thành viên J2TEAM Community chia sẻ, mình mở package.json và thấy được đăng ký lệnh start như sau:

> node server/app.js | react-scripts start

Ta thấy lệnh start này thực hiện 2 lệnh là node server/app.js và react-scripts start. Mình mở tiếp file app.js, thấy code khá bình thường. Mình suy đoán có thể mã độc nằm trong các file được require vào.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMLWrA-oelLRpaLEm7kT8nMwZW5Zn0y8SGKtodddrEVQ6nIZiUHTH__4rMSWk6-nRhOYORC0VcoaGow4erQA_UU7NEyyP6hHjK7eb1kYrmLFGLfPQb5hCQEvaXIbF_CzFPKsXtvAiePV4kdcTIJ3RNU9Fvo_xysXVwriYZhrbnAd2IyECGOmve_UuhZRYt=w640-h434)

fs, path hay http đều là các thư viện sẵn có của NodeJS. Không có gì đáng ngờ. express, socket.io, config và mongoose thì là các thư viện phổ biến mình biết, nên có thể loại bỏ. js-chess-engine là một thư viện có 140 sao trên GitHub, không phổ biến, chúng ta cần để ý.

Mình chợt để ý tới dòng 15:

![](https://blogger.googleusercontent.com/img/a/AVvXsEgbMCHMzCDVKHMFxfnPsbDknNS4vJ-S_NVFnaMhqPYa3CmxDzOwbxoaup8N-noAxgT364L0hfm1Gfa0X0JqPrcuVPXejDHQBS4NDlI5UEaL_RWN4dJYr_HhQtqJ3hBbT_L82gguDxBRqfLYb43IHDhKWw8ki9hxH8OURlPIADiERWDRJRmDHxLl0BLGn281=w640-h422)

Thông thường dev sẽ khai báo hết các câu require ở trên đầu, mình liền kiểm tra file token này.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjm6Tbq5gs8wBDKJViwQZPyZxDy9tCRTHP_qmGwnRBQB0RJknRYRaVbViv-Kw0SU04skE_5MCzwMRUnoA_YDNLFJhW36kwmiOQ7KrJPBo-v-B-3aXzNsJohLDtF9yBdLq5JlAwihB9SqBz87F5pkzvaoizU5Ii8OiKT-vK_3w6uVMnt2kUPUwvyz2uTVKhD=w640-h420)

Nhìn mọi thứ rất bình thường đúng không? Nhưng mình chợt chú ý vào thanh cuộn ngang, có một đoạn code đã được đẩy ra rất xa bằng khoảng trắng (space).

![](https://blogger.googleusercontent.com/img/a/AVvXsEg46WMeCyRNctvjhj4soYUo2BKBDcjrKQq0lK7_TLacUgGVdbEcLrPI-SarBQnCLDpr26EU0BLK2RzwVEIeWU1SgSt6jutJLVAyG8G_zqblAtEJjxdfew8Da0cYtQlYCe_9LI2VSBTPq72H9hTedWmFgWOgF4KIpGzjSw4aKz_YehYtqNR9JkumRWrZsQDB=w640-h378)

Đây là một đoạn JavaScript đã bị làm rối (obfuscation). Chắc chắn là nó!

Mình sử dụng công cụ làm đẹp mã nguồn và kết hợp với ChatGPT để làm code "có thể đọc được" (readable) và diễn giải hành vi:

![](https://blogger.googleusercontent.com/img/a/AVvXsEhWUHo6hutH2jpcozr068VkFbzFfisjHztzptwcwVAefVEAGI8n96rtqF96LJLwOhr1ow4dPSoWDcmg4DdJ6QxOJm2p-MaMRoqwDFgm6Eih8yBA2UffbFqkWfWbaIaqrn0Ho_PhkZgeDEOX9sIZmCs1gxM0621Qm1ci2qd9Gv6CJM0_QYRetA2lvZDAdolh=w613-h640)

Trích đoạn bài viết trong J2TEAM Community:

> - Khi clone về chạy thử thì cũng không thấy gì bất thường, thấy nó tự popup yêu cầu tải python về máy thì mình cũng chủ quan nghĩ rằng do bên phần mềm máy ảo yêu cầu nên accept luôn (máy ảo mình dùng là parallels desktop for Mac). Chạy source lên thì thấy game cũng khá chỉnh chu và có đầu tư [video 2], càng củng cố niềm tin của mình về ông khách này cho tới khi window báo lỗi
>
> "Failed to get data from the clipboard (error-2147221040: OpenClipboard Failed)" [ảnh 3],
>
> thì mình cũng bắt đầu nghi ngờ và check task manager - phần startup app phát hiện 1 tiến trình lạ tên là "Window Update Script" có status enable [ảnh 4].

Ta có thể nhận ra đoạn code JavaScript kia chính là code đã thực hiện tải Python, tạo file Window Update Script rồi thực thi nó. Đây là ảnh do bạn ấy cung cấp:

![](https://blogger.googleusercontent.com/img/a/AVvXsEgdDcwXjGOVbUdSy9R8BUtBRLQPNkpTIMfpS_wS59XrD7ySHFZ2anygrTIuJpm-KZoDkcO0G3Au7Otnb8uwkDHXAScqRzhhmFt1vsdTkgIMZNkLmZWBKwGiUpVZ81eE3MwjMCPBSNyCXYx8dhpC-nkJbd8TKc202jgTDofpC4yC2Yu9Zlw9tNuylPrFK_6O=w640-h292)

Theo như chia sẻ từ bạn La Vi Sar trên nhóm:

> Đoạn Script đã được obfuscation (thủ thuật làm rối code) [ảnh 5] và thực thi bằng đoạn script sau:
>
> \= lambda _ : import('zlib').decompress(import('base64').b64decode(__[::-1]))

Ta thấy kẻ tấn công sử dụng kết hợp Zlib (nén) và Base64 để che giấu.

Mã Python này sẽ làm gì? Dựa theo file bạn La Vi Sar cung cấp, ta thấy các hành vi sau:

- Thêm đường dẫn vào danh sách loại trừ của Windows Defender

![](https://blogger.googleusercontent.com/img/a/AVvXsEjDECx7rnhPanPk0FwrznxVPkdvhY9NuQ8MgL02k5nV2FxCT2EiifyhKCN0oFdsyfCZm304NdMD-AkOvL2A2RO0ssWAS9o6bWGGhB4ofQKeF-73Iqx0Ok7GBzQu3KEFM8o5D5aQvk0wpyYRr_PBEhBoJ_gJITiZrnYGbx4jVlmv-mGt7bCGRrjTs3nueXce=w640-h322)

- Đăng ký khởi động cùng Windows, đặt tên "Runtime Broker" để ngụy trang

![](https://blogger.googleusercontent.com/img/a/AVvXsEigBULDUTUCggw7vzmEMf_Yfw0yghCpVJHTMAHOuo_YUMvuo_T_OQKRzFzXVpPDtlOo5PGl2If1ofVGrkwAcBwDNdM1Cu6VXzYQrkcVAx3K9PLZutKpJlF50vqu3nST2p_ZhsHMPVH7x0C54ges1kypyKWLP1xRP9-7rTRKqDK8rtUJTO3zq4QexhCBNELU=w640-h234)

- Tải file

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9avGnNjsm_IlgwSrP3NxGDwl8pU9kg8kBDTag3-BhDKWu2B3LnnNLBGrfH-50AYynaoEOVlrpqxwzFxjj0etB5idCcqoYGXt8Cq7guojmbm7lU4-GSmzjScZgpO1VRdBl0JTvWzi5EFun3iZ6M8J2Q4pAQAvljz8bAyE6p5CTLEGGVfXScQoF6SuN70I_=w640-h406)

- Yêu cầu chạy với quyền Admin

![](https://blogger.googleusercontent.com/img/a/AVvXsEimB6RQGBokl1w0CxmRMc_1MD5I4HanVquBM99NN_VzKCI2h4SbpiOw-eYczqWAzDCyPCL66G5KjbZh60D564KVGJevdFCouXapG-yKf2yR_y3JhpPpx366W2PsW9nxlRSFvudiemR6y81C8Ef5k4cnePD1P-H-z8bxgNlG10KGf_YLJUzntCB-CaEupz0h=w640-h332)

- Các thư mục được truy cập:
  - `%APPDATA%\Microsoft\Windows\Applications`
  - `%LOCALAPPDATA%\Microsoft\Windows\Applications`
  - Thư mục temp

Dựa theo các từ khóa trong mã nguồn python thì mình tìm được nó chính là con malware được phân tích trong video này: https://www.youtube.com/watch?v=xoOfxz5w-p0

Mã độc mã code python trên sẽ tải về và thực thi trên máy bạn là malware Tsunami.

### Tấn công thông qua Dependency

Ngoài việc chèn mã độc vào script, kẻ tấn công còn có thể khai thác dependency (thư viện phụ thuộc) độc hại. Những thư viện này được thêm vào mục dependencies hoặc devDependencies trong file package.json.

Hình thức tấn công này đặc biệt nguy hiểm bởi nó lợi dụng lòng tin của lập trình viên vào các thư viện bên thứ ba. Thậm chí, kẻ tấn công có thể:

1. Sử dụng thư viện phổ biến bị bỏ rơi: Chiếm quyền kiểm soát từ maintainer không còn duy trì thư viện, rồi chèn mã độc.
2. Tạo thư viện trùng tên: Đặt tên gần giống với một thư viện nổi tiếng, khiến lập trình viên vô tình tải nhầm (typosquatting).

## Kết luận

Những hình thức tấn công qua Git hook, NPM script, hoặc dependency đều nhằm khai thác sự chủ quan của lập trình viên. Hãy luôn cẩn trọng khi làm việc với mã nguồn từ các nguồn không đáng tin cậy và duy trì thói quen kiểm tra kỹ lưỡng trước khi chạy bất kỳ lệnh nào trên máy cá nhân.

Khi nhận thấy các dấu hiệu bất thường, bạn nên ngừng ngay việc chạy mã và rà soát lại toàn bộ repository để phát hiện nguy cơ tiềm ẩn. Nếu có thể, hãy sử dụng các môi trường độc lập (sandbox) khi chạy lệnh nào đó.

Chúc mọi người an toàn!

[Theo dõi mình](https://linktr.ee/j2team) để xem thêm các nội dung về công nghệ nhé!
