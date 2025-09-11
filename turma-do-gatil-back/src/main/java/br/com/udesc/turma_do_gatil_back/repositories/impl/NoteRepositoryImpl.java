package br.com.udesc.turma_do_gatil_back.repositories.impl;

import br.com.udesc.turma_do_gatil_back.entities.Note;
import br.com.udesc.turma_do_gatil_back.entities.QNote;
import br.com.udesc.turma_do_gatil_back.repositories.NoteRepositoryCustom;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class NoteRepositoryImpl implements NoteRepositoryCustom {

    @Autowired
    private JPAQueryFactory queryFactory;

    private final QNote qNote = QNote.note;

    @Override
    public Page<Note> findWithFilters(UUID catId, String text, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        BooleanBuilder predicate = new BooleanBuilder();

        if (catId != null) {
            predicate.and(qNote.catId.eq(catId));
        }

        if (StringUtils.hasText(text)) {
            predicate.and(qNote.text.containsIgnoreCase(text));
        }

        if (startDate != null) {
            predicate.and(qNote.date.goe(startDate));
        }

        if (endDate != null) {
            predicate.and(qNote.date.loe(endDate));
        }

        JPAQuery<Note> query = queryFactory.selectFrom(qNote)
                .where(predicate)
                .orderBy(qNote.date.desc());

        long total = query.fetchCount();

        List<Note> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Note> findByCatId(UUID catId, Pageable pageable) {
        JPAQuery<Note> query = queryFactory.selectFrom(qNote)
                .where(qNote.catId.eq(catId))
                .orderBy(qNote.date.desc());

        long total = query.fetchCount();

        List<Note> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Note> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        JPAQuery<Note> query = queryFactory.selectFrom(qNote)
                .where(qNote.date.between(startDate, endDate))
                .orderBy(qNote.date.desc());

        long total = query.fetchCount();

        List<Note> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    @Override
    public Page<Note> findByTextContainingIgnoreCase(String text, Pageable pageable) {
        JPAQuery<Note> query = queryFactory.selectFrom(qNote)
                .where(qNote.text.containsIgnoreCase(text))
                .orderBy(qNote.date.desc());

        long total = query.fetchCount();

        List<Note> content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }
}
