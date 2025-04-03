# Harmony Player - Trình Phát Nhạc Tối Giản

## Giới thiệu

Harmony Player là một ứng dụng web trình phát nhạc tối giản, đẹp mắt được xây dựng với React, TypeScript, và ShadcnUI. Ứng dụng này cho phép người dùng tải lên, quản lý và phát các tệp nhạc MP3 với giao diện hiện đại, trực quan.

## Tính năng

- 🎵 Phát nhạc với các chức năng cơ bản: phát/tạm dừng, bài trước/bài tiếp theo
- 📊 Thanh tiến trình có thể tương tác để tua bài hát
- 🔊 Điều chỉnh âm lượng với thanh trượt trực quan
- 📁 Tải lên và quản lý danh sách phát của riêng bạn
- 🎨 Hỗ trợ chế độ sáng/tối
- 📱 Thiết kế đáp ứng, hoạt động trên nhiều thiết bị

## Cấu trúc dự án

```
src/
├── components/            # Các component UI
│   ├── AudioControl.tsx   # Nút điều khiển phát/tạm dừng, bài trước/bài tiếp theo
│   ├── MusicPlayer.tsx    # Component chính của trình phát nhạc
│   ├── Playlist.tsx       # Danh sách phát 
│   ├── ProgressBar.tsx    # Thanh tiến độ bài hát
│   ├── ThemeToggle.tsx    # Công tắc chuyển đổi chế độ sáng/tối
│   ├── TrackArtwork.tsx   # Hiển thị ảnh bìa bài hát
│   ├── TrackUpload.tsx    # Chức năng tải lên bài hát
│   ├── VolumeControl.tsx  # Điều khiển âm lượng
│   └── ui/                # Các component UI từ thư viện shadcn/ui
├── context/
│   ├── AudioContext.tsx   # Context quản lý trạng thái âm thanh
│   └── ThemeContext.tsx   # Context quản lý chủ đề
├── hooks/                 # Các custom hook
├── pages/                 # Các trang của ứng dụng
│   ├── Index.tsx          # Trang chính
│   └── NotFound.tsx       # Trang lỗi 404
└── App.tsx                # Component gốc của ứng dụng
```

## Cách hoạt động

### Quản lý âm thanh

- **AudioContext**: Sử dụng React Context API để quản lý trạng thái của trình phát nhạc và cung cấp các hàm điều khiển.
- **useAudioPlayback**: Hook tùy chỉnh để xử lý việc phát âm thanh, bao gồm phát/tạm dừng, chuyển bài, và cập nhật trạng thái.
- **usePlaylist**: Hook tùy chỉnh để quản lý danh sách phát, bao gồm thêm/xóa bài hát và cập nhật metadata.

### Luồng dữ liệu

1. Người dùng tải lên các tệp MP3 thông qua component `TrackUpload`.
2. Các tệp được chuyển đổi thành đối tượng Track và lưu trữ trong state của `AudioContext`.
3. Danh sách phát hiển thị các bài hát đã tải lên thông qua component `Playlist`.
4. Khi người dùng chọn một bài hát, component `MusicPlayer` sẽ phát bài hát đó bằng cách sử dụng Web Audio API.
5. Các điều khiển như `AudioControl`, `ProgressBar`, và `VolumeControl` tương tác với `AudioContext` để thay đổi trạng thái phát.

### Giao diện người dùng

- Dự án sử dụng thư viện shadcn/ui cho các component UI như nút, thanh trượt, và menu thả xuống.
- Tailwind CSS được sử dụng cho styling, giúp tạo ra giao diện đẹp mắt và đáp ứng.
- Hỗ trợ chế độ sáng/tối thông qua `ThemeContext`, cho phép người dùng chọn chủ đề ưa thích.

## Cách sử dụng

1. **Tải lên nhạc**: Nhấp vào nút "Tải lên" để thêm các tệp MP3 từ máy tính của bạn.
2. **Phát nhạc**: Nhấp vào một bài hát trong danh sách phát để bắt đầu phát.
3. **Điều khiển phát**: Sử dụng các nút phát/tạm dừng, bài trước/bài tiếp theo để điều khiển việc phát.
4. **Thanh tiến trình**: Kéo thanh tiến trình để tua đến vị trí khác trong bài hát.
5. **Âm lượng**: Điều chỉnh âm lượng bằng thanh trượt âm lượng.
6. **Chế độ sáng/tối**: Chuyển đổi giữa chế độ sáng và tối bằng nút chuyển đổi ở góc trên bên phải.

## Công nghệ sử dụng

- **React**: Thư viện JavaScript để xây dựng giao diện người dùng
- **TypeScript**: Bổ sung kiểu dữ liệu tĩnh cho JavaScript
- **Vite**: Công cụ build hiện đại, nhanh chóng
- **ShadcnUI/Radix UI**: Thư viện component UI có thể tùy chỉnh cao
- **Tailwind CSS**: Framework CSS tiện ích
- **React Router**: Thư viện định tuyến cho React
- **TanStack Query**: Thư viện quản lý trạng thái không đồng bộ

## Hướng phát triển

- Thêm tính năng lưu trữ danh sách phát trên local storage
- Thêm hỗ trợ cho các định dạng âm thanh khác (FLAC, WAV)
- Thêm hiệu ứng hình ảnh đẹp mắt hơn
- Thêm tính năng xem lời bài hát
- Tích hợp với các dịch vụ phát nhạc trực tuyến
