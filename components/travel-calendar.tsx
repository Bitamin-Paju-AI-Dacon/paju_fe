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
    {
      date: new Date(2025, 10, 15), // 11월 15일
      title: "출판도시 투어",
      location: "파주 출판문화정보산업단지",
      time: "10:00 AM"
    },
    {
      date: new Date(2025, 10, 20), // 11월 20일
      title: "책방거리 탐방",
      location: "헤이리 예술마을",
      time: "2:00 PM"
    },
    {
      date: new Date(2025, 10, 25), // 11월 25일
      title: "북카페 체험",
      location: "지혜의숲",
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

