"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

interface TravelEvent {
  date: Date
  title: string
  location: string
  time?: string
}

export function TravelCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
  // 샘플 여행 일정 데이터
  const travelEvents: TravelEvent[] = [
    // 11월 일정
    {
      date: new Date(2025, 10, 5), // 11월 5일
      title: "출판도시 투어",
      location: "파주 출판문화정보산업단지",
      time: "10:00 AM"
    },
    {
      date: new Date(2025, 10, 15), // 11월 15일
      title: "책방거리 탐방",
      location: "milkbook",
      time: "2:00 PM"
    },
    {
      date: new Date(2025, 10, 20), // 11월 20일
      title: "북카페 체험",
      location: "출판단지 북카페눈",
      time: "11:00 AM"
    },
    {
      date: new Date(2025, 10, 25), // 11월 25일
      title: "서점 탐방",
      location: "열화당",
      time: "3:00 PM"
    },
    // 12월 일정
    {
      date: new Date(2025, 11, 1), // 12월 1일
      title: "출판사 견학",
      location: "문학동네",
      time: "10:00 AM"
    },
    {
      date: new Date(2025, 11, 10), // 12월 10일
      title: "지혜의숲 방문",
      location: "출판단지 지혜의숲",
      time: "2:00 PM"
    },
    {
      date: new Date(2025, 11, 20), // 12월 20일
      title: "은하수 출판사 투어",
      location: "출판단지 은하수 출판사",
      time: "11:00 AM"
    },
    {
      date: new Date(2025, 11, 28), // 12월 28일
      title: "음악세계 방문",
      location: "출판단지 음악세계",
      time: "4:00 PM"
    },
    // 1월 일정
    {
      date: new Date(2026, 0, 5), // 1월 5일
      title: "김영사 사서점 탐방",
      location: "김영사 사서점",
      time: "10:00 AM"
    },
    {
      date: new Date(2026, 0, 15), // 1월 15일
      title: "파인드아웃 방문",
      location: "파인드아웃",
      time: "2:00 PM"
    },
    {
      date: new Date(2026, 0, 25), // 1월 25일
      title: "출판도시 재방문",
      location: "파주 출판문화정보산업단지",
      time: "11:00 AM"
    },
    // 2월 일정
    {
      date: new Date(2026, 1, 3), // 2월 3일
      title: "milkbook 서점 탐방",
      location: "milkbook",
      time: "10:00 AM"
    },
    {
      date: new Date(2026, 1, 14), // 2월 14일
      title: "북카페 체험",
      location: "출판단지 북카페눈",
      time: "3:00 PM"
    },
    {
      date: new Date(2026, 1, 22), // 2월 22일
      title: "열화당 서점 방문",
      location: "열화당",
      time: "2:00 PM"
    },
    // 3월 일정
    {
      date: new Date(2026, 2, 5), // 3월 5일
      title: "문학동네 출판사 견학",
      location: "문학동네",
      time: "10:00 AM"
    },
    {
      date: new Date(2026, 2, 15), // 3월 15일
      title: "지혜의숲 재방문",
      location: "출판단지 지혜의숲",
      time: "2:00 PM"
    },
    {
      date: new Date(2026, 2, 25), // 3월 25일
      title: "은하수 출판사 투어",
      location: "출판단지 은하수 출판사",
      time: "11:00 AM"
    }
  ]

  // 선택된 날짜의 이벤트 찾기
  const selectedEvents = travelEvents.filter(event => 
    selectedDate && 
    event.date.toDateString() === selectedDate.toDateString()
  )

  // 이벤트가 있는 날짜들
  const eventDates = travelEvents.map(event => event.date)

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">여행 캘린더</h1>
        <p className="text-sm text-muted-foreground">파주 여행 일정을 확인하세요</p>
      </div>
      
      <Card>
        <CardContent className="space-y-2 pt-2 px-4 pb-2">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="[&_button]:w-9 [&_button]:h-9 [&_td]:p-1.5"
              modifiers={{
                event: eventDates
              }}
              modifiersStyles={{
                event: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: '#3b82f6'
                }
              }}
            />
          </div>
          
          {selectedDate && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {selectedDate.toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                {selectedEvents.length > 0 && (
                  <Badge variant="secondary">{selectedEvents.length}개의 일정</Badge>
                )}
              </div>
              
              {selectedEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedEvents.map((event, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  이 날짜에 예정된 일정이 없습니다.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

